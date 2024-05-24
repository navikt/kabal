import { Express } from 'express';
import { WebSocketServer } from 'ws';
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

    const wss = new WebSocketServer({ server: httpServer });

    httpServer.on('upgrade', (req, socket, head) => {
      log.info({ msg: 'Upgrade request' });

      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
    });

    wss.on('connection', async (ws, req) => {
      log.info({ msg: 'Websocket connect' });

      if (req.url === undefined) {
        return ws.close(400, 'Bad Request');
      }

      const url = new URL(req.url);

      if (!url.pathname.startsWith('/collaboration/')) {
        return ws.close(404, 'Not Found');
      }

      const parts = url.pathname.split('/').filter((part) => part.length !== 0);

      if (parts.length !== 5) {
        return ws.close(404, 'Not Found');
      }

      const behandlingId = parts.at(2);
      const dokumentId = parts.at(4);

      if (behandlingId === undefined || dokumentId === undefined) {
        return ws.close(404, 'Not Found');
      }

      // Get auth header
      const authHeader = req.headers['authorization'];

      if (typeof authHeader !== 'string') {
        return ws.close(401, 'Unauthorized');
      }

      const traceId = ensureTraceparent(req);

      const oboAccessToken = await getOnBehalfOfAccessToken(authClient, authHeader, 'kabal-api', traceId);

      wsServer.handleConnection(ws, req, { behandlingId, dokumentId, oboAccessToken, accessToken: authHeader });
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
