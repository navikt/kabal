import { SMART_DOCUMENT_WRITE_ACCESS } from '@app/document-access/service';
import { getLogger } from '@app/logger';
import { collaborationServer } from '@app/plugins/crdt/collaboration-server';
import { setShuttingDown } from '@app/shutdown';
import { EmojiIcons, sendToSlack } from '@app/slack';

const log = getLogger('process-errors');

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
            connection.close({ code: 1001, reason: 'SERVER_SHUTTING_DOWN' });
          } catch (error) {
            log.error({
              error,
              msg: `Error closing collaboration connection for document: ${connection.document.name}`,
            });
          }
        }
      }

      await SMART_DOCUMENT_WRITE_ACCESS.close();
      log.info({ msg: `Process ${process.pid} received a ${signal} signal. Shutting down now.` });
      process.exit(0);
    })
    .on('SIGINT', async (signal) => {
      const error = new Error(`Process ${process.pid} has been interrupted, ${signal}. Shutting down now.`);
      log.error({ error });
      process.exit(0);
    })
    .on('beforeExit', async (code) => {
      const msg = `Crash ${JSON.stringify(code)}`;
      log.error({ msg });
      await sendToSlack(msg, EmojiIcons.Broken);
    });
};
