import { setTimeout as sleep } from 'node:timers/promises';
import { SMART_DOCUMENT_WRITE_ACCESS } from '@/document-access/service';
import { getLogger } from '@/logger';
import { collaborationServer } from '@/plugins/crdt/collaboration-server';
import { isConnectionContext } from '@/plugins/crdt/context';
import { endActivity } from '@/plugins/crdt/crdt-tracing';
import { setShuttingDown } from '@/shutdown';
import { EmojiIcons, sendToSlack } from '@/slack';
import { shutdownTracing } from '@/tracing';

const log = getLogger('process-errors');

/** Time given to the close frames sent on SIGTERM to reach the clients before the process exits. */
const CLOSE_FRAME_FLUSH_MS = 250;

export const processErrors = () => {
  process
    .on('unhandledRejection', (reason, promise) => {
      log.error({ error: reason, msg: `Process ${process.pid} received a unhandledRejection signal` });

      promise.catch((error: unknown) => log.error({ error, msg: 'Uncaught error' }));
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    })
    .on('uncaughtException', (error) =>
      log.error({ error, msg: `Process ${process.pid} received a uncaughtException signal` }),
    )
    .on('SIGTERM', async (signal) => {
      setShuttingDown();

      log.info({
        msg: `Process ${process.pid} received a ${signal} signal. Closing ${collaborationServer.getConnectionsCount()} collaboration connections...`,
      });

      for (const [, document] of collaborationServer.documents) {
        for (const [, { connection }] of document.connections) {
          try {
            if (isConnectionContext(connection.context)) {
              endActivity(connection.context);
              // `Connection.close()` only sends a hocuspocus CLOSE *message*, and the client-side
              // provider hardcodes that message to close code 1000 - indistinguishable from a clean
              // shutdown. Close the socket itself so the client gets 1001 and takes the immediate
              // reconnect path instead of the generic unknown-close path with its session check and
              // backoff. It also makes shutdowns tellable apart from network failures (1006) in the
              // client-side logs.
              connection.context.socket.close(1001, 'SERVER_SHUTTING_DOWN');
            } else {
              connection.close({ code: 1001, reason: 'SERVER_SHUTTING_DOWN' });
            }
          } catch (error) {
            log.error({
              error,
              msg: `Error closing collaboration connection for document: ${connection.document.name}`,
            });
          }
        }
      }

      // `process.exit()` below does not flush pending socket writes. Without this pause the close
      // frames can still be sitting in the send buffer when the process dies, leaving the client
      // with an abrupt 1006 instead of the 1001 we just sent.
      await sleep(CLOSE_FRAME_FLUSH_MS);

      await SMART_DOCUMENT_WRITE_ACCESS.close();
      log.info({ msg: `Process ${process.pid} received a ${signal} signal. Shutting down now.` });
      await shutdownTracing();
      process.exit(0);
    })
    .on('SIGINT', async (signal) => {
      const error = new Error(`Process ${process.pid} has been interrupted, ${signal}. Shutting down now.`);
      log.error({ error });
      await shutdownTracing();
      process.exit(0);
    })
    .on('beforeExit', async (code) => {
      const msg = `Crash ${JSON.stringify(code)}`;
      log.error({ msg });
      await sendToSlack(msg, EmojiIcons.Broken);
    });
};
