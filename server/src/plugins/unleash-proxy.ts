import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyPlugin from 'fastify-plugin';
import { Type } from 'typebox';
import { NAIS_APP_NAME, NAIS_POD_NAME } from '@/config/config';
import { isDeployed } from '@/config/env';
import { withSpan } from '@/helpers/tracing';
import { getLogger } from '@/logger';
import { NAV_IDENT_PLUGIN_ID } from '@/plugins/nav-ident';

const log = getLogger('unleash-proxy-plugin');

export const unleashProxyPlugin = fastifyPlugin(
  async (app) => {
    app
      .withTypeProvider<TypeBoxTypeProvider>()
      .get(
        '/feature-toggle/:toggle',
        { schema: { params: Type.Object({ toggle: Type.String() }) } },
        async (req, reply) => {
          return withSpan(
            'unleash.get_toggle',
            {
              toggle: req.params.toggle,
              nav_ident: req.navIdent,
              tab_id: req.tab_id ?? '',
              client_version: req.client_version ?? '',
            },
            async (span) => {
              const body = { navIdent: req.navIdent, appName: NAIS_APP_NAME, podName: NAIS_POD_NAME };

              const toggleResponse = await fetch(`${UNLEASH_PROXY_URL}/${req.params.toggle}`, {
                method: 'QUERY',
                body: JSON.stringify(body),
              });

              span.setAttribute('http.status_code', toggleResponse.status);

              if (!toggleResponse.ok) {
                log.error({
                  msg: 'Unleash proxy request failed',
                  tab_id: req.tab_id,
                  client_version: req.client_version,
                  data: {
                    status: toggleResponse.status,
                    statusText: await toggleResponse.text(),
                    proxyVersion: toggleResponse.headers.get('App-Version'),
                  },
                });

                return reply.status(500).send({ error: 'Failed to fetch feature toggle' });
              }

              const toggle = await toggleResponse.json();

              return reply.send(toggle);
            },
          );
        },
      );
  },
  { fastify: '5', name: 'unleash-proxy', dependencies: [NAV_IDENT_PLUGIN_ID] },
);

export const UNLEASH_PROXY_URL = isDeployed
  ? 'http://klage-unleash-proxy/features'
  : 'https://kabal.intern.dev.nav.no/feature-toggle';
