import { isDeployed } from '@app/config/env';
import { getLogger } from '@app/logger';
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

export const CRDT_PLUGIN_ID = 'crdt';

const log = getLogger(CRDT_PLUGIN_ID);

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

          log.info({
            msg: 'Creating new collaboration document',
            trace_id: req.trace_id,
            span_id: req.span_id,
            tab_id: req.tab_id,
            client_version: req.client_version,
            data: { behandlingId },
          });

          if (isDeployed) {
            await req.ensureOboAccessToken('kabal-api');
          }

          const { body } = req;

          if (!isObject(body) || !('content' in body) || !Array.isArray(body.content)) {
            log.error({
              msg: 'Invalid request body',
              trace_id: req.trace_id,
              span_id: req.span_id,
              tab_id: req.tab_id,
              client_version: req.client_version,
              data: { behandlingId },
            });

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

            log.info({
              msg: 'Saving new document to database',
              trace_id: req.trace_id,
              span_id: req.span_id,
              tab_id: req.tab_id,
              client_version: req.client_version,
              data: { behandlingId, data },
            });

            const res = await fetch(`${KABAL_API_URL}/behandlinger/${behandlingId}/smartdokumenter`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...getHeaders(req),
              },
              body: JSON.stringify({
                ...body,
                data,
              }),
            });

            if (!res.ok) {
              log.error({
                msg: `Failed to save document. API responded with status code ${res.status}.`,
                trace_id: req.trace_id,
                span_id: req.span_id,
                tab_id: req.tab_id,
                client_version: req.client_version,
                data: { behandlingId, statusCode: res.status },
              });
            } else {
              log.info({
                msg: 'Saved new document to database',
                trace_id: req.trace_id,
                span_id: req.span_id,
                tab_id: req.tab_id,
                client_version: req.client_version,
                data: { behandlingId },
              });
            }

            return reply.send(res);
          } catch (error) {
            log.error({
              error,
              msg: 'Failed to save document',
              trace_id: req.trace_id,
              span_id: req.span_id,
              tab_id: req.tab_id,
              client_version: req.client_version,
              data: { behandlingId },
            });

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

          log.info({
            msg: 'Websocket connection init',
            trace_id: req.trace_id,
            span_id: req.span_id,
            tab_id: req.tab_id,
            client_version: req.client_version,
            data: { behandlingId, dokumentId },
          });

          if (behandlingId.length === 0 || dokumentId.length === 0) {
            log.warn({
              msg: 'Invalid behandlingId or dokumentId',
              trace_id: req.trace_id,
              span_id: req.span_id,
              tab_id: req.tab_id,
              client_version: req.client_version,
              data: { behandlingId, dokumentId },
            });

            return socket.close(4404, 'Not Found');
          }

          try {
            if (isDeployed) {
              const oboAccessToken = await req.ensureOboAccessToken('kabal-api');

              if (oboAccessToken === undefined) {
                log.warn({
                  msg: 'Tried to authenticate collaboration connection without OBO access token',
                  trace_id: req.trace_id,
                  span_id: req.span_id,
                  tab_id: req.tab_id,
                  client_version: req.client_version,
                  data: { behandlingId, dokumentId },
                });

                return socket.close(4401, 'Unauthorized');
              }
            }

            log.info({
              msg: 'Handing over connection to HocusPocus',
              trace_id: req.trace_id,
              span_id: req.span_id,
              tab_id: req.tab_id,
              client_version: req.client_version,
              data: { behandlingId, dokumentId },
            });

            collaborationServer.handleConnection(socket, req.raw, {
              behandlingId,
              dokumentId,
              req,
            } satisfies ConnectionContext);
          } catch (e) {
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
