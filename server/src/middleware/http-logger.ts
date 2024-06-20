import { AnyObject, getLogger } from '@app/logger';

const httpLogger = getLogger('http');

interface HttpData extends AnyObject {
  method: string;
  url: string;
  statusCode: number;
  traceId: string | undefined;
  client_version: string | undefined;
  tab_id: string | undefined;
  responseTime: number;
}

export const logHttpRequest = ({ traceId, client_version, tab_id, ...data }: HttpData) => {
  const msg = `Response ${data.statusCode} ${data.method} ${data.url} ${data.responseTime}ms`;

  if (data.statusCode >= 500) {
    httpLogger.error({ msg, traceId, data, client_version, tab_id });

    return;
  }

  if (data.statusCode >= 400) {
    httpLogger.warn({ msg, traceId, data, client_version, tab_id });

    return;
  }

  httpLogger.debug({ msg, traceId, data, client_version, tab_id });
};
