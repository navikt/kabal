import { Express } from 'express';
import { wsServer } from '@app/routes/collaboration';
import { setupDocumentRoutes } from '@app/routes/document';
import { PORT } from './config/config';
import { getLogger } from './logger';
import { setupProxy } from './routes/setup-proxy';
import { setupStaticRoutes } from './routes/static-routes';
import { resetClientsAndUniqueUsersMetrics, setupVersionRoute } from './routes/version';
import { EmojiIcons, sendToSlack } from './slack';

const log = getLogger('init');

export const init = async (server: Express) => {
  try {
    server.use(setupVersionRoute());
    server.use(setupDocumentRoutes());
    server.use(await setupProxy());
    server.use(setupStaticRoutes());

    const httpServer = server.listen(PORT, () => log.info({ msg: `Listening on port ${PORT}` }));

    httpServer.on('upgrade', (req, socket) => {
      if (req.url === undefined || !new URL(req.url).pathname.startsWith('/collaboration')) {
        return;
      }

      log.info({ msg: 'Upgrade request' });
      wsServer.handleConnection(socket, req, {});
    });
  } catch (e) {
    await resetClientsAndUniqueUsersMetrics();

    if (e instanceof Error) {
      log.error({ error: e, msg: 'Server crashed' });
      await sendToSlack(`Server crashed: ${e.message}`, EmojiIcons.Scream);
    } else if (typeof e === 'string' || typeof e === 'number') {
      const msg = `Server crashed: ${JSON.stringify(e)}`;
      log.error({ msg });
      await sendToSlack(msg, EmojiIcons.Scream);
    }
    process.exit(1);
  }
};
