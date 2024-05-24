import { Express } from 'express';
import { getAzureADClient } from '@app/auth/get-auth-client';
import { getOnBehalfOfAccessToken } from '@app/auth/on-behalf-of';
import { ensureTraceparent } from '@app/request-id';
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
    const authClient = await getAzureADClient();

    server.use(setupVersionRoute());
    server.use(setupDocumentRoutes());
    server.use(await setupProxy(authClient));
    server.use(setupStaticRoutes());

    const httpServer = server.listen(PORT, () => log.info({ msg: `Listening on port ${PORT}` }));

    httpServer.on('upgrade', async (req, socket) => {
      log.info({ msg: 'Upgrade request' });

      if (req.url === undefined) {
        return socket.destroy();
      }

      const url = new URL(req.url);

      // Valid path is /collaboration/behandlinger/:behandlingId/dokumenter/:dokumentId
      if (!url.pathname.startsWith('/collaboration/')) {
        return socket.destroy();
      }

      const parts = url.pathname.split('/').filter((part) => part.length !== 0);

      if (parts.length !== 5) {
        return socket.destroy();
      }

      const behandlingId = parts.at(2);
      const dokumentId = parts.at(4);

      if (behandlingId === undefined || dokumentId === undefined) {
        return socket.destroy();
      }

      // Get auth header
      const authHeader = req.headers['authorization'];

      if (typeof authHeader !== 'string') {
        return socket.destroy();
      }

      const traceId = ensureTraceparent(req);

      const oboAccessToken = await getOnBehalfOfAccessToken(authClient, authHeader, 'kabal-api', traceId);

      wsServer.handleConnection(socket, req, { behandlingId, dokumentId, oboAccessToken, accessToken: authHeader });
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
