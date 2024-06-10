import { resetClientsAndUniqueUsersMetrics } from '@app/routes/version/version';
import { getLogger } from './logger';
import { EmojiIcons, sendToSlack } from './slack';
import { isDeployed } from '@app/config/env';

const log = getLogger('process-errors');

export const processErrors = () => {
  process
    .on('unhandledRejection', (reason, promise) => {
      log.error({ error: reason, msg: `Process ${process.pid} received a unhandledRejection signal` });

      promise.catch((error: unknown) => log.error({ error, msg: `Uncaught error` }));
    })
    .on('uncaughtException', (error) =>
      log.error({ error, msg: `Process ${process.pid} received a uncaughtException signal` }),
    )
    .on('SIGTERM', async (signal) => {
      if (isDeployed) {
        log.info({ msg: `Process ${process.pid} received a ${signal} signal. Shutting down in 2 seconds.` });
        await resetClientsAndUniqueUsersMetrics();
      } else {
        log.info({ msg: `Process ${process.pid} received a ${signal} signal. Shutting down now.` });
      }
      process.exit(0);
    })
    .on('SIGINT', async (signal) => {
      if (isDeployed) {
        const error = new Error(`Process ${process.pid} has been interrupted, ${signal}. Shutting down in 2 seconds.`);
        log.error({ error });
        await resetClientsAndUniqueUsersMetrics();
      } else {
        const error = new Error(`Process ${process.pid} has been interrupted, ${signal}. Shutting down now.`);
        log.error({ error });
      }
      process.exit(1);
    })
    .on('beforeExit', async (code) => {
      const msg = `Crash ${JSON.stringify(code)}`;
      log.error({ msg });
      sendToSlack(msg, EmojiIcons.Scream);
      await resetClientsAndUniqueUsersMetrics();
    });
};
