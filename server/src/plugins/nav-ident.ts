import { getLogger } from '@app/logger';
import { ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/access-token';
import { CLIENT_VERSION_PLUGIN_ID } from '@app/plugins/client-version';
import { TAB_ID_PLUGIN_ID } from '@app/plugins/tab-id';
import { TRACEPARENT_PLUGIN_ID } from '@app/plugins/traceparent/traceparent';

import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    navIdent: string;
  }
}

const log = getLogger('nav-ident-plugin');

export const NAV_IDENT_PLUGIN_ID = 'nav-ident';

export const navIdentPlugin = fastifyPlugin(
  (app, _, pluginDone) => {
    app.decorateRequest('navIdent', '');

    app.addHook('preHandler', async (req) => {
      const { accessToken } = req;

      if (accessToken.length === 0) {
        return;
      }

      const payload = accessToken.split('.').at(1);

      if (payload === undefined) {
        return;
      }

      try {
        const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');
        const { NAVident: navIdent } = JSON.parse(decodedPayload) as TokenPayload;

        if (typeof navIdent !== 'string') {
          throw new Error('NAV-ident is not a string');
        }

        if (navIdent.length === 0) {
          throw new Error('NAV-ident is empty');
        }

        req.navIdent = navIdent;
      } catch (error) {
        log.warn({
          msg: 'Failed to parse NAV-ident from token',
          error,
          trace_id: req.trace_id,
          span_id: req.span_id,
          tab_id: req.tab_id,
          client_version: req.client_version,
        });
      }
    });

    pluginDone();
  },
  {
    fastify: '4',
    name: NAV_IDENT_PLUGIN_ID,
    dependencies: [ACCESS_TOKEN_PLUGIN_ID, CLIENT_VERSION_PLUGIN_ID, TAB_ID_PLUGIN_ID, TRACEPARENT_PLUGIN_ID],
  },
);

interface TokenPayload {
  aud: string;
  iss: string;
  iat: number;
  nbf: number;
  exp: number;
  aio: string;
  azp: string;
  azpacr: string;
  groups: string[];
  name: string;
  oid: string;
  preferred_username: string;
  rh: string;
  scp: string;
  sub: string;
  tid: string;
  uti: string;
  ver: string;
  NAVident: string;
  azp_name: string;
}
