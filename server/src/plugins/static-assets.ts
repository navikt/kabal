import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { SpanStatusCode } from '@opentelemetry/api';
import type { FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { frontendDistDirectoryPath } from '@/config/config';
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

export const STATIC_ASSETS_PLUGIN_ID = 'static-assets';

export const staticAssetsPlugin = fastifyPlugin(
  async (app) => {
    app.get('/assets/*', async (req, reply) => handleUnresolvedAsset(req, reply));
    app.get('/file-viewer/assets/*', async (req, reply) => handleUnresolvedAsset(req, reply));

    const faviconPath = path.join(frontendDistDirectoryPath, 'favicon.ico');
    const faviconBuffer = existsSync(faviconPath) ? readFileSync(faviconPath) : null;

    if (faviconBuffer === null) {
      app.get('/favicon.ico', async (_, reply) => reply.code(404).send());
    } else {
      app.get('/favicon.ico', async (_, reply) => reply.header('content-type', 'image/x-icon').send(faviconBuffer));
    }
  },
  { fastify: '5', name: STATIC_ASSETS_PLUGIN_ID, dependencies: [NAV_IDENT_PLUGIN_ID] },
);
