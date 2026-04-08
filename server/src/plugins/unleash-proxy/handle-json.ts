import type { FastifyReply } from 'fastify';
import { NAIS_APP_NAME, NAIS_POD_NAME } from '@/config/config';
import { withSpan } from '@/helpers/tracing';
import { getLogger } from '@/logger';
import { type ToggleRequest, UNLEASH_PROXY_URL } from '@/plugins/unleash-proxy/types';

const log = getLogger('unleash-proxy-plugin');

export const handleJson = async (req: ToggleRequest, reply: FastifyReply) => {
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

      const headers = new Headers({ 'content-type': 'application/json' });

      if (req.query.traceparent !== undefined) {
        headers.set('traceparent', req.query.traceparent);
      }

      const toggleResponse = await fetch(`${UNLEASH_PROXY_URL}/${req.params.toggle}`, {
        method: 'QUERY',
        headers,
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

        return reply.status(502).send({ error: 'Failed to fetch feature toggle' });
      }

      const toggle = await toggleResponse.json();

      return reply.send(toggle);
    },
  );
};
