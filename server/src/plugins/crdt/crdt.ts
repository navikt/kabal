import { Type, type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { slateNodesToInsertDelta } from '@slate-yjs/core';
import type { FastifyRequest } from 'fastify/types/request';
import fastifyPlugin from 'fastify-plugin';
import { Doc, encodeStateAsUpdateV2, XmlText } from 'yjs';
import { ApiClientEnum } from '@/config/config';
import { isObject } from '@/functions/functions';
import { parseTokenPayload } from '@/helpers/token-parser';
import { withSpan } from '@/helpers/tracing';
import { type AnyObject, getLogger, type Level, type LogArgs } from '@/logger';
import { ACCESS_TOKEN_PLUGIN_ID } from '@/plugins/access-token';
import { CLIENT_VERSION_PLUGIN_ID } from '@/plugins/client-version';
import { getHeaders } from '@/plugins/crdt/api/headers';
import { KABAL_API_URL } from '@/plugins/crdt/api/url';
import { collaborationServer } from '@/plugins/crdt/collaboration-server';
import type { ConnectionContext } from '@/plugins/crdt/context';
import { NAV_IDENT_PLUGIN_ID } from '@/plugins/nav-ident';
import { getOboToken, OBO_ACCESS_TOKEN_PLUGIN_ID } from '@/plugins/obo-token';
import { TAB_ID_PLUGIN_ID } from '@/plugins/tab-id';

export const CRDT_PLUGIN_ID = 'crdt';

const log = getLogger(CRDT_PLUGIN_ID);

const logReq = (msg: string, req: FastifyRequest, data: AnyObject, level: Level = 'info', error?: unknown) => {
  const { tab_id, client_version } = req;
  const body: LogArgs = { msg, tab_id, client_version, data };

  if (error !== undefined) {
    body.error = error;
  }

  log[level](body);
};

const TextNode = Type.Object({
  text: Type.String(),
});

const Descendant = Type.Cyclic(
  { Descendant: Type.Union([Type.Object({ children: Type.Array(Type.Ref('Descendant')) }), TextNode]) },
  'Descendant',
);

export const crdtPlugin = fastifyPlugin(
  async (app) => {
    app.withTypeProvider<TypeBoxTypeProvider>().post(
      '/collaboration/behandlinger/:behandlingId/dokumenter',
      {
        schema: {
          tags: ['collaboration'],
          params: Type.Object({ behandlingId: Type.String() }),
          body: Type.Object({
            content: Type.Array(Descendant),
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

          const res = await withSpan(
            'collaboration.create_document',
            {
              behandling_id: behandlingId,
              nav_ident: req.navIdent,
              tab_id: req.tab_id ?? '',
              client_version: req.client_version ?? '',
            },
            async (span) => {
              const response = await fetch(`${KABAL_API_URL}/behandlinger/${behandlingId}/smartdokumenter`, {
                method: 'POST',
                headers: { ...headers, 'content-type': 'application/json' },
                body: JSON.stringify({ ...body, data }),
              });

              span.setAttribute('http.status_code', response.status);

              if (response.ok) {
                logReq('Saved new document to database', req, { behandlingId }, 'debug');
              } else {
                const msg = `Failed to save document. API responded with status code ${response.status}`;
                logReq(msg, req, { behandlingId, statusCode: response.status }, 'error');
              }

              return response;
            },
          );

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
        config: { otel: false },
        schema: {
          tags: ['collaboration'],
          params: Type.Object({ behandlingId: Type.String(), dokumentId: Type.String() }),
          querystring: Type.Object({ traceparent: Type.Optional(Type.String()) }),
        },
      },
      async (
        socket,
        req: FastifyRequest<{
          Params: { behandlingId: string; dokumentId: string };
          Querystring: { traceparent?: string };
        }>,
      ) => {
        const { behandlingId, dokumentId } = req.params;
        logReq('Websocket connection init', req, { behandlingId, dokumentId }, 'debug');

        const { navIdent, tab_id, client_version, headers } = req;
        const { traceparent } = req.query;

        const context: ConnectionContext = {
          behandlingId,
          dokumentId,
          tab_id,
          client_version,
          navIdent,
          cookie: headers.cookie,
          socket,
          traceparent,
        };

        // Register message handler immediately to avoid losing the client's auth message.
        // Token validation is handled by onConnect/onAuthenticate hooks
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
        const oboAccessToken = await getOboToken(ApiClientEnum.KABAL_API, req, reply);

        if (oboAccessToken === undefined) {
          return reply.status(400).send('Failed to refresh OBO token');
        }

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
      TAB_ID_PLUGIN_ID,
      NAV_IDENT_PLUGIN_ID,
      CLIENT_VERSION_PLUGIN_ID,
    ],
  },
);
