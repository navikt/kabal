import { PROXY_VERSION } from '@app/config/config';
import { PROXY_VERSION_HEADER } from '@app/headers';
import { MiddlewareHandler } from 'hono';

export const setProxyVersionHeader: MiddlewareHandler = async (context, next) => {
  context.header(PROXY_VERSION_HEADER, PROXY_VERSION);

  return await next();
};
