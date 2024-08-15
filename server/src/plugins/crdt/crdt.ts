import { isDeployed } from '@app/config/env';
import { getLogger } from '@app/logger';
import { ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/access-token';
import { collaborationServer } from '@app/plugins/crdt/collaboration-server';
import { ConnectionContext } from '@app/plugins/crdt/context';
import { OBO_ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/obo-token';
import { TAB_ID_PLUGIN_ID } from '@app/plugins/tab-id';
import { TRACEPARENT_PLUGIN_ID } from '@app/plugins/traceparent/traceparent';
import { Type, TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyPlugin from 'fastify-plugin';

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

          if (behandlingId.length === 0) {
            log.warn({
              msg: 'Invalid behandlingId',
              trace_id: req.trace_id,
              span_id: req.span_id,
              tab_id: req.tab_id,
              client_version: req.client_version,
              data: { behandlingId },
            });

            return reply.status(400).send('No behandlingId provided');
          }

          if (isDeployed) {
            await req.ensureOboAccessToken('kabal-api');
          }

          // const { } = req.body;
          // TODO: Create Yjs document from JSON.
          // TODO: base64 encode Yjs document.
          // TODO: POST to Kabal API with base64 and JSON.
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
