import type { IncomingMessage } from 'node:http';
import { Socket } from 'node:net';
import type { Duplex } from 'node:stream';
import { getCacheKey } from '@app/auth/cache/cache';
import { getAzureADClient } from '@app/auth/get-auth-client';
import { refreshOnBehalfOfAccessToken } from '@app/auth/on-behalf-of';
import { ApiClientEnum } from '@app/config/config';
import { isDeployed } from '@app/config/env';
import { parseTokenPayload } from '@app/helpers/token-parser';
import { type AnyObject, type Level, type LogArgs, getLogger } from '@app/logger';
import { ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/access-token';
import { getHeaders } from '@app/plugins/crdt/api/headers';
import { KABAL_API_URL } from '@app/plugins/crdt/api/url';
import { collaborationServer } from '@app/plugins/crdt/collaboration-server';
import type { ConnectionContext } from '@app/plugins/crdt/context';
import { isObject } from '@app/plugins/crdt/functions';
import { NAV_IDENT_PLUGIN_ID } from '@app/plugins/nav-ident';
import { OBO_ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/obo-token';
import { TAB_ID_PLUGIN_ID } from '@app/plugins/tab-id';
import { TRACEPARENT_PLUGIN_ID } from '@app/plugins/traceparent/traceparent';
import { Type, type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { slateNodesToInsertDelta } from '@slate-yjs/core';
import fastifyPlugin from 'fastify-plugin';
import type { FastifyRequest } from 'fastify/types/request';
import WebSocket from 'ws';
import * as Y from 'yjs';

const UPGRADE_MAP: Map<IncomingMessage, { socket: Duplex; head: Buffer }> = new Map();
const UPGRADE_TIMEOUT = 1_000;

export const CRDT_PLUGIN_ID = 'crdt';

const log = getLogger(CRDT_PLUGIN_ID);

const logReq = (msg: string, req: FastifyRequest, data: AnyObject, level: Level = 'info', error?: unknown) => {
  const { trace_id, span_id, tab_id, client_version } = req;
  const body: LogArgs = { msg, trace_id, span_id, tab_id, client_version, data };

  if (error !== undefined) {
    body.error = error;
  }

  log[level](body);
};

export const crdtPlugin = fastifyPlugin(
  async (app) => {
    app.withTypeProvider<TypeBoxTypeProvider>().post(
      '/collaboration/behandlinger/:behandlingId/dokumenter',
      {
        schema: {
          tags: ['collaboration'],
          params: Type.Object({ behandlingId: Type.String() }),
          body: Type.Object({
            content: Type.Array(
              Type.Recursive((This) =>
                Type.Union([
                  Type.Object({ text: Type.String() }),
                  Type.Object({
                    children: Type.Array(This),
                  }),
                ]),
              ),
            ),
            templateId: Type.String(),
            tittel: Type.String(),
            dokumentTypeId: Type.String(),
            parentId: Type.String(),
            language: Type.String(),
          }),
          produces: ['application/json'],
        },
      },
      async (req, reply) => {
        const { behandlingId } = req.params;
        logReq('Creating new collaboration document', req, { behandlingId });

        const { body } = req;

        if (!isObject(body) || !('content' in body) || !Array.isArray(body.content)) {
          logReq('Invalid request body', req, { behandlingId }, 'error');

          return reply.status(400).send();
        }

        try {
          const { content } = body;
          const document = new Y.Doc();
          const sharedRoot = document.get('content', Y.XmlText);
          const insertDelta = slateNodesToInsertDelta(content);
          sharedRoot.applyDelta(insertDelta);
          const state = Y.encodeStateAsUpdateV2(document);
          const data = Buffer.from(state).toString('base64');

          logReq('Saving new document to database', req, { behandlingId, data });

          const headers = await getHeaders(req);

          const res = await fetch(`${KABAL_API_URL}/behandlinger/${behandlingId}/smartdokumenter`, {
            method: 'POST',
            headers: { ...headers, 'content-type': 'application/json' },
            body: JSON.stringify({ ...body, data }),
          });

          if (!res.ok) {
            const msg = `Failed to save document. API responded with status code ${res.status}`;
            logReq(msg, req, { behandlingId, statusCode: res.status }, 'error');
          } else {
            logReq('Saved new document to database', req, { behandlingId }, 'debug');
          }

          return reply.send(res);
        } catch (error) {
          logReq('Failed to save document', req, { behandlingId }, 'error', error);

          return reply.status(500).send();
        }
      },
    );

    const wss = new WebSocket.Server({ noServer: true });

    app.server.on('upgrade', (rawRequest, socket, head) => {
      UPGRADE_MAP.set(rawRequest, { socket, head });

      // Make sure the upgrade request is deleted, even if the handler does not.
      setTimeout(() => {
        if (UPGRADE_MAP.has(rawRequest)) {
          log.warn({ msg: 'Upgrade request timed out' });
          UPGRADE_MAP.delete(rawRequest);
        }
      }, UPGRADE_TIMEOUT);
    });

    app.withTypeProvider<TypeBoxTypeProvider>().get(
      '/collaboration/behandlinger/:behandlingId/dokumenter/:dokumentId',
      {
        schema: {
          tags: ['collaboration'],
          params: Type.Object({ behandlingId: Type.String(), dokumentId: Type.String() }),
        },
      },
      async (req, reply) => {
        const upgradeData = UPGRADE_MAP.get(req.raw);
        UPGRADE_MAP.delete(req.raw);

        if (upgradeData === undefined) {
          return reply.code(400).send('No upgrade data found');
        }

        const { behandlingId, dokumentId } = req.params;
        logReq('Websocket connection init', req, { behandlingId, dokumentId });

        const oboAccessToken = await req.getOboAccessToken(ApiClientEnum.KABAL_API, reply);

        if (isDeployed && oboAccessToken === undefined) {
          const msg = 'Tried to authenticate collaboration connection without OBO access token';
          logReq(msg, req, { behandlingId, dokumentId }, 'warn');

          return reply.code(401).send('Unauthorized');
        }

        const { socket, head } = upgradeData;

        try {
          const webSocket = await new Promise<WebSocket>((resolve, reject) => {
            wss.handleUpgrade(req.raw, socket, head, (ws) => {
              wss.emit('connection', socket, req.raw);

              socket.on('error', (error) => {
                app.log.error(error);
                reject(error);
              });

              resolve(ws);
            });
          });

          reply.raw.assignSocket(new Socket(socket));

          reply.hijack();

          logReq('Handing over connection to HocusPocus', req, { behandlingId, dokumentId });

          const { navIdent, trace_id, span_id, tab_id, client_version, headers } = req;

          const context: ConnectionContext = {
            behandlingId,
            dokumentId,
            trace_id,
            span_id,
            tab_id,
            client_version,
            navIdent,
            cookie: headers.cookie,
          };

          collaborationServer.handleConnection(webSocket, req.raw, context);
        } catch (e) {
          reply.code(500).send(e instanceof Error ? e.message : 'Internal Server Error');
          console.error(e);
        }
      },
    );

    app.withTypeProvider<TypeBoxTypeProvider>().get(
      '/collaboration/obo-token-exp',
      {
        schema: {
          response: { 200: Type.Object({ expiresIn: Type.Number() }), 401: Type.String() },
        },
      },
      async (req, reply) => {
        const oboAccessToken = await req.getOboAccessToken(ApiClientEnum.KABAL_API);

        if (oboAccessToken === undefined) {
          return reply.status(401).send('Unauthorized');
        }

        const parsedToken = parseTokenPayload(oboAccessToken);

        if (parsedToken === undefined) {
          return reply.send({ expiresIn: 0 });
        }

        const now = Math.ceil(Date.now() / 1_000);

        return reply.status(200).send({ expiresIn: parsedToken.exp - now });
      },
    );

    app.withTypeProvider<TypeBoxTypeProvider>().get(
      '/collaboration/refresh-obo-access-token',
      {
        schema: {
          response: { 200: Type.Object({ expiresIn: Type.Number() }), 400: Type.String() },
        },
      },
      async (req, reply) => {
        const { navIdent, accessToken, trace_id, span_id } = req;

        const authClient = await getAzureADClient();
        const cacheKey = getCacheKey(navIdent, ApiClientEnum.KABAL_API);

        const oboAccessToken = await refreshOnBehalfOfAccessToken(
          authClient,
          accessToken,
          cacheKey,
          ApiClientEnum.KABAL_API,
          trace_id,
          span_id,
        );

        const parsed = parseTokenPayload(oboAccessToken);

        if (parsed === undefined) {
          return reply.status(400).send('Failed to refresh OBO token');
        }

        const now = Math.ceil(Date.now() / 1_000);

        return reply.status(200).send({ expiresIn: parsed.exp - now });
      },
    );
  },
  {
    fastify: '5',
    name: CRDT_PLUGIN_ID,
    dependencies: [
      ACCESS_TOKEN_PLUGIN_ID,
      OBO_ACCESS_TOKEN_PLUGIN_ID,
      TRACEPARENT_PLUGIN_ID,
      TAB_ID_PLUGIN_ID,
      NAV_IDENT_PLUGIN_ID,
    ],
  },
);
