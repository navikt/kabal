import { isDeployed } from '@app/config/env';
import { getLogger } from '@app/logger';
import { resetClientsAndUniqueUsersMetrics } from '@app/plugins/version/unique-users-gauge';
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
      process.exit(0);
    })
    .on('beforeExit', async (code) => {
      const msg = `Crash ${JSON.stringify(code)}`;
      log.error({ msg });
      await resetClientsAndUniqueUsersMetrics();
      await sendToSlack(msg, EmojiIcons.Broken);
    });
};
