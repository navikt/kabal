import { EmojiIcons, sendToSlack } from './slack';

export const processErrors = () => {
  process
    .on('unhandledRejection', (reason, promise) => {
      console.error(`Process ${process.pid} received a unhandledRejection signal, ${reason}`);
      promise.catch((err) => {
        console.error(`Uncaught error: ${err}`);
        process.exit(1);
      });
    })
    .on('uncaughtException', (e) => {
      console.error(`Process ${process.pid} received a uncaughtException signal, ${e}`);
      process.exit(1);
    })
    .on('SIGTERM', (signal) => {
      console.error(`Process ${process.pid} received a SIGTERM signal, ${signal}`);
      process.exit(1);
    })

    .on('SIGINT', (signal) => {
      console.error(`Process ${process.pid} has been interrupted, ${signal}`);
      process.exit(1);
    })
    .on('beforeExit', async (code) => {
      sendToSlack(`Crash ${JSON.stringify(code)}`, EmojiIcons.Scream);
    });
};
