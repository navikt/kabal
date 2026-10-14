import { SpanStatusCode } from '@opentelemetry/api';
import type { FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { CDN_BASE_URL } from '@/config/config';
import { getLogger } from '@/logger';
import { NAV_IDENT_PLUGIN_ID } from '@/plugins/nav-ident';
import { tracer } from '@/tracing/tracer';

const log = getLogger('unresolved-assets');

const handleUnresolvedAsset = (req: FastifyRequest, reply: FastifyReply) => {
  const { url, navIdent } = req;
  const referer = req.headers.referer ?? '';

  log.warn({
    msg: `Unresolved asset request: ${url}`,
    data: { url, referer, nav_ident: navIdent },
  });

  return tracer.startActiveSpan(
    'unresolved_asset',
    { attributes: { 'http.url': url, 'http.status_code': 404, nav_ident: navIdent, 'http.referer': referer } },
    (span) => {
      span.setStatus({ code: SpanStatusCode.ERROR, message: `Unresolved asset: ${url}` });
      span.end();

      return reply.code(404).send();
    },
  );
};

const FAVICON_URL = `${CDN_BASE_URL}/assets/favicon.ico`;

export const STATIC_ASSETS_PLUGIN_ID = 'static-assets';

export const staticAssetsPlugin = fastifyPlugin(
  async (app) => {
    app.get('/assets/*', async (req, reply) => handleUnresolvedAsset(req, reply));
    app.get('/file-viewer/assets/*', async (req, reply) => handleUnresolvedAsset(req, reply));

    // Browsers request /favicon.ico implicitly for non-HTML responses (e.g. PDFs). Redirect to the CDN.
    app.get('/favicon.ico', async (_, reply) =>
      reply.header('cache-control', 'public, max-age=86400').redirect(FAVICON_URL, 302),
    );
  },
  { fastify: '5', name: STATIC_ASSETS_PLUGIN_ID, dependencies: [NAV_IDENT_PLUGIN_ID] },
);
