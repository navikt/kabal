import { Express } from 'express';
import { WebSocketServer } from 'ws';
import { getAzureADClient } from '@app/auth/get-auth-client';
import { getOnBehalfOfAccessToken } from '@app/auth/on-behalf-of';
import { ensureTraceparent } from '@app/request-id';
import { collaborationServer } from '@app/routes/collaboration';
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

    wss.on('connection', async (ws, req) => {
      const traceId = ensureTraceparent(req);

      log.info({ msg: 'Websocket connect', traceId });

      if (req.url === undefined) {
        log.warn({ msg: 'No URL in request', traceId });

        return ws.close(400, 'Bad Request');
      }

      const url = new URL(req.url, `https://${req.headers.host}`);

      if (!url.pathname.startsWith('/collaboration/')) {
        log.warn({ msg: 'Invalid URL', data: { url: req.url }, traceId });

        return ws.close(404, 'Not Found');
      }

      const { pathname } = url;
      const parts = pathname.split('/').filter((part) => part.length !== 0);

      if (parts.length !== 5) {
        log.warn({ msg: 'Invalid URL, too short', data: { path: pathname }, traceId });

        return ws.close(404, 'Not Found');
      }

      const behandlingId = parts.at(2);
      const dokumentId = parts.at(4);

      if (behandlingId === undefined || dokumentId === undefined) {
        log.warn({ msg: 'Invalid URL, missing IDs', data: { path: pathname }, traceId });

        return ws.close(404, 'Not Found');
      }

      // Get auth header
      const authHeader = req.headers['authorization'];

      if (typeof authHeader !== 'string') {
        log.warn({ msg: 'Unauthorized', traceId });

        return ws.close(401, 'Unauthorized');
      }

      try {
        const oboAccessToken = await getOnBehalfOfAccessToken(authClient, authHeader, 'kabal-api', traceId);

        log.info({
          msg: 'Handing over Websocket to collaboration server',
          data: { behandlingId, dokumentId },
          traceId,
        });

        collaborationServer.handleConnection(ws, req, {
          behandlingId,
          dokumentId,
          oboAccessToken,
          accessToken: authHeader,
        });
      } catch (error) {
        log.error({ msg: 'Failed to get OBO token', error, traceId });

        ws.close(500, 'Internal Server Error');
      }
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
