import promBundle from 'express-prom-bundle';
import { register } from 'prom-client';
import { normalizePath } from './normalize-path';

export const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  excludeRoutes: ['/metrics', '/isAlive', '/isReady'],
  normalizePath: ({ originalUrl }) => normalizePath(originalUrl),
  promRegistry: register,
  formatStatusCode: ({ statusCode }) => {
    if (statusCode >= 200 && statusCode < 400) {
      return '2xx (3xx)';
    }

    return statusCode;
  },
});
