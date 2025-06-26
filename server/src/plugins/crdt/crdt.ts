import { getCacheKey } from '@app/auth/cache/cache';
import { getAzureADClient } from '@app/auth/get-auth-client';
import { refreshOnBehalfOfAccessToken } from '@app/auth/on-behalf-of';
import { ApiClientEnum } from '@app/config/config';
import { isDeployed } from '@app/config/env';
import { isObject } from '@app/functions/functions';
import { parseTokenPayload } from '@app/helpers/token-parser';
import { type AnyObject, getLogger, type Level, type LogArgs } from '@app/logger';
import { ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/access-token';
import { getHeaders } from '@app/plugins/crdt/api/headers';
import { KABAL_API_URL } from '@app/plugins/crdt/api/url';
import { collaborationServer } from '@app/plugins/crdt/collaboration-server';
import type { ConnectionContext } from '@app/plugins/crdt/context';
import { NAV_IDENT_PLUGIN_ID } from '@app/plugins/nav-ident';
import { OBO_ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/obo-token';
import { TAB_ID_PLUGIN_ID } from '@app/plugins/tab-id';
import { TRACEPARENT_PLUGIN_ID } from '@app/plugins/traceparent/traceparent';
import { Type, type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { slateNodesToInsertDelta } from '@slate-yjs/core';
import type { FastifyRequest } from 'fastify/types/request';
import fastifyPlugin from 'fastify-plugin';
import { Doc, encodeStateAsUpdateV2, XmlText } from 'yjs';

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

        if (!(isObject(body) && 'content' in body && Array.isArray(body.content))) {
          logReq('Invalid request body', req, { behandlingId }, 'error');

          return reply.status(400).send();
        }

        try {
          const { content } = body;
          const document = new Doc();
          const sharedRoot = document.get('content', XmlText);
          const insertDelta = slateNodesToInsertDelta(content);
          sharedRoot.applyDelta(insertDelta);
          const state = encodeStateAsUpdateV2(document);
          const data = Buffer.from(state).toString('base64');

          logReq('Saving new document to database', req, { behandlingId, data });

          const headers = await getHeaders(req);

          const res = await fetch(`${KABAL_API_URL}/behandlinger/${behandlingId}/smartdokumenter`, {
            method: 'POST',
            headers: { ...headers, 'content-type': 'application/json' },
            body: JSON.stringify({ ...body, data }),
          });

          if (res.ok) {
            logReq('Saved new document to database', req, { behandlingId }, 'debug');
          } else {
            const msg = `Failed to save document. API responded with status code ${res.status}`;
            logReq(msg, req, { behandlingId, statusCode: res.status }, 'error');
          }

          return reply.send(res);
        } catch (error) {
          logReq('Failed to save document', req, { behandlingId }, 'error', error);

          return reply.status(500).send();
        }
      },
    );

    app.withTypeProvider<TypeBoxTypeProvider>().get(
      '/collaboration/behandlinger/:behandlingId/dokumenter/:dokumentId',
      {
        websocket: true,
        schema: {
          tags: ['collaboration'],
          params: Type.Object({ behandlingId: Type.String(), dokumentId: Type.String() }),
        },
      },
      async (socket, req) => {
        const { behandlingId, dokumentId } = req.params;
        logReq('Websocket connection init', req, { behandlingId, dokumentId }, 'debug');

        const oboAccessToken = await req.getOboAccessToken(ApiClientEnum.KABAL_API);

        if (isDeployed && oboAccessToken === undefined) {
          const msg = 'Tried to authenticate collaboration connection without OBO access token';
          logReq(msg, req, { behandlingId, dokumentId }, 'warn');

          return socket.close(4401, msg);
        }

        logReq('Handing over connection to HocusPocus', req, { behandlingId, dokumentId }, 'debug');

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

        collaborationServer.handleConnection(socket, req.raw, context);
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
          response: { 200: Type.Object({ exp: Type.Number(), expiresIn: Type.Number() }), 400: Type.String() },
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

        return reply.status(200).send({ exp: parsed.exp, expiresIn: parsed.exp - now });
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
