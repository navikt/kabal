import { parseTokenPayload } from '@app/helpers/token-parser';
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
  async (app) => {
    app.decorateRequest('navIdent', '');

    // biome-ignore lint/suspicious/useAwait: Needs to return a promise
    app.addHook('preHandler', async (req) => {
      const { accessToken } = req;

      if (accessToken.length === 0) {
        return;
      }

      try {
        const parsedPayload = parseTokenPayload(accessToken);

        if (parsedPayload === undefined) {
          return;
        }

        const { NAVident: navIdent } = parsedPayload;

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
  },
  {
    fastify: '5',
    name: NAV_IDENT_PLUGIN_ID,
    dependencies: [ACCESS_TOKEN_PLUGIN_ID, CLIENT_VERSION_PLUGIN_ID, TAB_ID_PLUGIN_ID, TRACEPARENT_PLUGIN_ID],
  },
);
