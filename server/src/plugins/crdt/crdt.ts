import { getLogger } from '@app/logger';
import { ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/access-token';
import { collaborationServer } from '@app/plugins/crdt/server';
import { OBO_ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/obo-token';
import { TAB_ID_PLUGIN_ID } from '@app/plugins/tab-id';
import { TRACEPARENT_PLUGIN_ID } from '@app/plugins/traceparent/traceparent';
import fastifyPlugin from 'fastify-plugin';
import { WebSocketServer } from 'ws';

const log = getLogger('crdt');

export const CRDT_PLUGIN_ID = 'crdt';

export const crdtPlugin = fastifyPlugin(
  (app, _, pluginDone) => {
    const wss = new WebSocketServer({ noServer: true });

    app.addHook('onRequest', async (req, reply) => {
      // /collaboration/behandlinger/${behandlingId}/dokumenter/${dokumentId}
      const splitPath = req.url.split('/');

      if (splitPath.length !== 6) {
        return;
      }

      const [, base, behandlinger, behandlingId, dokumenter, dokumentId] = splitPath;

      if (
        base !== 'collaboration' ||
        behandlinger !== 'behandlinger' ||
        dokumenter !== 'dokumenter' ||
        behandlingId === undefined ||
        dokumentId === undefined ||
        behandlingId.length === 0 ||
        dokumentId.length === 0
      ) {
        return;
      }

      const { upgrade, connection } = req.headers;

      console.log({ upgrade, connection });

      if (connection?.toLowerCase() !== 'upgrade' || upgrade?.toLowerCase() !== 'websocket') {
        reply.send(404);

        return;
      }

      const { accessToken, getOboAccessToken } = req;

      log.info({ msg: 'Websocket connect' });

      wss.handleUpgrade(req.raw, req.socket, Buffer.alloc(0), (ws) => {
        wss.emit('connection', ws, req);
        reply.hijack();

        collaborationServer.handleConnection(ws, req.raw, {
          behandlingId,
          dokumentId,
          oboAccessToken: getOboAccessToken('kabal-api'),
          accessToken,
        });
      });
    });

    pluginDone();
  },
  {
    fastify: '4',
    name: CRDT_PLUGIN_ID,
    dependencies: [ACCESS_TOKEN_PLUGIN_ID, OBO_ACCESS_TOKEN_PLUGIN_ID, TRACEPARENT_PLUGIN_ID, TAB_ID_PLUGIN_ID],
  },
);
