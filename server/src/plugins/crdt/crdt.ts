import { isDeployed } from '@app/config/env';
import { AnyObject, Level, LogArgs, getLogger } from '@app/logger';
import { ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/access-token';
import * as Y from 'yjs';
import { collaborationServer } from '@app/plugins/crdt/collaboration-server';
import { ConnectionContext } from '@app/plugins/crdt/context';
import { OBO_ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/obo-token';
import { TAB_ID_PLUGIN_ID } from '@app/plugins/tab-id';
import { TRACEPARENT_PLUGIN_ID } from '@app/plugins/traceparent/traceparent';
import { Type, TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { slateNodesToInsertDelta } from '@slate-yjs/core';
import fastifyPlugin from 'fastify-plugin';
import { KABAL_API_URL } from '@app/plugins/crdt/api/url';
import { getHeaders } from '@app/plugins/crdt/api/headers';
import { isObject } from '@app/plugins/crdt/functions';
import { FastifyRequest } from 'fastify/types/request';

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
  (app, _, pluginDone) => {
    app
      .withTypeProvider<TypeBoxTypeProvider>()
      .post(
        '/collaboration/behandlinger/:behandlingId/dokumenter',
        {
          schema: {
            tags: ['collaboration'],
            params: Type.Object({ behandlingId: Type.String() }),
            body: {
              content: Type.Array(Type.Object({})),
              templateId: Type.String(),
              tittel: Type.String(),
              dokumentTypeId: Type.String(),
              parentId: Type.String(),
              language: Type.String(),
            },
          },
        },
        async (req, reply) => {
          const { behandlingId } = req.params;
          logReq('Creating new collaboration document', req, { behandlingId });

          if (isDeployed) {
            await req.ensureOboAccessToken('kabal-api');
          }

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

            const res = await fetch(`${KABAL_API_URL}/behandlinger/${behandlingId}/smartdokumenter`, {
              method: 'POST',
              headers: { 'content-type': 'application/json', ...getHeaders(req) },
              body: JSON.stringify({ ...body, data }),
            });

            if (!res.ok) {
              const msg = `Failed to save document. API responded with status code ${res.status}`;
              logReq(msg, req, { behandlingId, statusCode: res.status }, 'error');
            } else {
              logReq('Saved new document to database', req, { behandlingId });
            }

            return reply.send(res);
          } catch (error) {
            logReq('Failed to save document', req, { behandlingId }, 'error', error);

            return reply.status(500).send();
          }
        },
      )
      .get(
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
          logReq('Websocket connection init', req, { behandlingId, dokumentId });

          if (behandlingId.length === 0 || dokumentId.length === 0) {
            logReq('Invalid behandlingId or dokumentId', req, { behandlingId, dokumentId }, 'warn');

            return socket.close(4404, 'Not Found');
          }

          try {
            if (isDeployed) {
              const oboAccessToken = await req.ensureOboAccessToken('kabal-api');

              if (oboAccessToken === undefined) {
                const msg = 'Tried to authenticate collaboration connection without OBO access token';
                logReq(msg, req, { behandlingId, dokumentId }, 'warn');

                return socket.close(4401, 'Unauthorized');
              }

              if (false) {
                const res = await fetch(
                  `${KABAL_API_URL}/behandlinger/${behandlingId}/smartdokumenter/${dokumentId}/access`,
                  {
                    method: 'GET',
                    headers: {
                      Authorization: `Bearer ${oboAccessToken}`,
                    },
                  },
                );

                if (!res.ok) {
                  logReq('Failed to establish collaboration connection', req, { behandlingId, dokumentId }, 'error');

                  return socket.close(4403, 'Forbidden');
                }

                // TODO: Parse response body and check if user has access to document.
                /*
                  Posssible response body:
                  enum Access {
                    Read = 'read',
                    Write = 'write',
                    None = 'none',
                  }
                */
              }
            }

            logReq('Handing over connection to HocusPocus', req, { behandlingId, dokumentId });

            collaborationServer.handleConnection(socket, req.raw, {
              behandlingId,
              dokumentId,
              req,
            } satisfies ConnectionContext);
          } catch (e) {
            socket.close(5500, e instanceof Error ? e.message : 'Internal Server Error');
            console.error(e);
          }
        },
      );

    pluginDone();
  },
  {
    fastify: '4',
    name: CRDT_PLUGIN_ID,
    dependencies: [
      '@fastify/websocket',
      ACCESS_TOKEN_PLUGIN_ID,
      OBO_ACCESS_TOKEN_PLUGIN_ID,
      TRACEPARENT_PLUGIN_ID,
      TAB_ID_PLUGIN_ID,
    ],
  },
);
