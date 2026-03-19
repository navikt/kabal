import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyPlugin from 'fastify-plugin';
import { Type } from 'typebox';
import { NAIS_APP_NAME, NAIS_POD_NAME } from '@/config/config';
import { isDeployed } from '@/config/env';
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
          const body = { navIdent: req.navIdent, appName: NAIS_APP_NAME, podName: NAIS_POD_NAME };

          const toggleResponse = await fetch(`${UNLEASH_PROXY_URL}/${req.params.toggle}`, {
            method: 'QUERY',
            body: JSON.stringify(body),
          });

          if (!toggleResponse.ok) {
            log.error({
              msg: 'Unleash proxy request failed',
              trace_id: req.trace_id,
              span_id: req.span_id,
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
  { fastify: '5', name: 'unleash-proxy', dependencies: [NAV_IDENT_PLUGIN_ID] },
);

export const UNLEASH_PROXY_URL = isDeployed
  ? 'http://klage-unleash-proxy/features'
  : 'https://kabal.intern.dev.nav.no/feature-toggle';
