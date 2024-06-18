import { Request, RequestHandler } from 'express';
import { VERSION } from '@app/config/config';

export const TAB_ID_KEY = 'x-tab-id';
export const CLIENT_VERSION_KEY = 'x-client-version';

/**
 * Translates known query parameters to headers. Useful for EventSource requests.
 */
export const queryParamsToHeaders: RequestHandler = (req, _, next) => {
  handleHeader(req, TAB_ID_KEY, 'tabId');
  handleHeader(req, CLIENT_VERSION_KEY, 'version');

  next();
};

const handleHeader = (req: Request, headerKey: string, queryKey: string) => {
  const header = req.get(headerKey);

  if (typeof header !== 'string' || header.length === 0) {
    const param = typeof req.query[queryKey] === 'string' ? req.query[queryKey] : undefined;

    if (typeof param === 'string' && param.length !== 0) {
      req.headers[headerKey] = param;
    }
  }

  return req;
};

export const setProxyVersionHeader: RequestHandler = (req, res, next) => {
  req.headers['x-proxy-version'] = VERSION;
  res.setHeader('x-proxy-version', VERSION);
  next();
};
