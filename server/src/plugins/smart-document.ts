import { SMART_DOCUMENT_WRITE_ACCESS } from '@app/document-access/service';
import { formatDuration, getDuration } from '@app/helpers/duration';
import { getLogger } from '@app/logger';
import { CLIENT_VERSION_PLUGIN_ID } from '@app/plugins/client-version';
import { HTTP_LOGGER_PLUGIN_ID } from '@app/plugins/http-logger';
import { NAV_IDENT_PLUGIN_ID } from '@app/plugins/nav-ident';
import { SERVER_TIMING_PLUGIN_ID } from '@app/plugins/server-timing';
import { TAB_ID_PLUGIN_ID } from '@app/plugins/tab-id';
import { TRACEPARENT_PLUGIN_ID } from '@app/plugins/traceparent/traceparent';
import { Type, type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('smart-document-write-access-sse');

const RETRY_DELAY = 5_000;

export const smartDocumentWriteAccessPlugin = fastifyPlugin(
  async (app) => {
    const RETRY_SSE = `retry: ${RETRY_DELAY}\n\n`;

    app
      .withTypeProvider<TypeBoxTypeProvider>()
      .get(
        '/smart-document-write-access/:documentId',
        { schema: { params: Type.Object({ documentId: Type.String({ format: 'uuid' }) }) } },
        async (req, reply) => {
          const { trace_id, span_id, tab_id, client_version, navIdent } = req;
          const { documentId } = req.params;

          if (req.headers.accept !== 'text/event-stream') {
            log.warn({
              msg: `Smart document SSE endpoint called with unsupported accept header "${req.headers.accept}"`,
              trace_id,
              span_id,
              data: { sse: true, accept: req.headers.accept },
            });

            return reply.status(415).send('This endpoint only accepts text/event-stream requests.');
          }

          if (reply.raw.headersSent) {
            log.warn({
              msg: 'Smart document SSE connection opened after headers sent',
              trace_id,
              span_id,
              data: { sse: true },
            });

            return;
          }

          const start = performance.now();

          log.debug({ msg: 'Smart document SSE connection opened', trace_id, span_id, data: { sse: true } });

          reply.raw.writeHead(200, {
            'content-type': 'text/event-stream',
            'cache-control': 'no-cache',
            connection: 'keep-alive',
          });

          reply.raw.write(RETRY_SSE);

          const removeHasAccessListener = SMART_DOCUMENT_WRITE_ACCESS.addHasAccessListener(
            documentId,
            navIdent,
            { trace_id, span_id, tab_id, client_version },
            (hasWriteAccess) => {
              reply.raw.write(formatSseEvent(EventNames.WRITE_ACCESS, hasWriteAccess ? 'read-write' : 'readonly'));
            },
          );

          const onClose = () => {
            removeHasAccessListener();
            req.raw.destroy();
          };

          new Promise<string>((resolve) => {
            req.socket.once('close', () => resolve('req.socket.once(close)'));
          })
            .then((reason) => {
              onClose();

              const duration = getDuration(start);

              log.debug({
                msg: `Smart document SSE connection closed after ${formatDuration(duration)} (${reason})`,
                trace_id,
                span_id,
                data: { sse: true, duration, reason },
              });

              return reason;
            })
            .catch((error) => {
              log.error({
                msg: 'Error during smart document SSE connection close',
                trace_id,
                span_id,
                error,
                data: { sse: true },
              });
              onClose();
            });
        },
      );
  },
  {
    fastify: '5',
    name: 'smart-document-write-access-sse',
    dependencies: [
      NAV_IDENT_PLUGIN_ID,
      SERVER_TIMING_PLUGIN_ID,
      TAB_ID_PLUGIN_ID,
      TRACEPARENT_PLUGIN_ID,
      CLIENT_VERSION_PLUGIN_ID,
      HTTP_LOGGER_PLUGIN_ID,
    ],
  },
);

enum EventNames {
  WRITE_ACCESS = 'write-access',
}

const formatSseEvent = (event: EventNames, data: string) => `event: ${event}\ndata: ${data}\n\n`;
