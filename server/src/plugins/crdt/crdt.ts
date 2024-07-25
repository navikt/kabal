import { getOnBehalfOfAccessToken } from '@app/auth/on-behalf-of';
import { CLIENT_VERSION_HEADER } from '@app/headers';
import { CLIENT_VERSION_QUERY, getHeaderOrQueryValue } from '@app/helpers/get-header-query';
import { getLogger } from '@app/logger';
import { FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { WebSocketServer } from 'ws';

const log = getLogger('crdt');

export const CRDT_PLUGIN_ID = 'crdt';

export const crdtPlugin = fastifyPlugin(
  (app, _, pluginDone) => {
    const wss = new WebSocketServer({ server: app.server });

    wss.on('connection', async (ws, req) => {
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

      const accessToken = authHeader.split(' ')[1];

      if (accessToken === undefined || accessToken.length === 0) {
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

    pluginDone();
  },
  { fastify: '4', name: CRDT_PLUGIN_ID },
);
