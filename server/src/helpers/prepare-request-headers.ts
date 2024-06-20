import { PROXY_VERSION } from '@app/config/config';
import { DEV_DOMAIN, isDeployed } from '@app/config/env';
import {
  AUTHORIZATION_HEADER,
  AZURE_AD_TOKEN_HEADER,
  CLIENT_VERSION_HEADER,
  PROXY_VERSION_HEADER,
  TAB_ID_HEADER,
} from '@app/headers';
import { getLogger } from '@app/logger';
import { FastifyRequest, RawServerBase, RequestGenericInterface } from 'fastify';

const log = getLogger('prepare-proxy-request-headers');

export const getProxyRequestHeaders = (
  req: FastifyRequest<RequestGenericInterface, RawServerBase>,
  appName: string,
): Record<string, string> => {
  const { traceparent, client_version, tab_id, accessToken, trace_id, span_id } = req;

  const headers: Record<string, string> = {
    ...omit(req.raw.headers, 'set-cookie'),
    host: isDeployed ? appName : DEV_DOMAIN,
    traceparent,
    [PROXY_VERSION_HEADER]: PROXY_VERSION,
  };

  if (exists(client_version)) {
    headers[CLIENT_VERSION_HEADER] = client_version;
  }

  if (exists(tab_id)) {
    headers[TAB_ID_HEADER] = tab_id;
  }

  if (exists(accessToken)) {
    headers[AZURE_AD_TOKEN_HEADER] = accessToken;
  }

  const oboAccessToken = req.getOboAccessToken(appName);

  if (oboAccessToken !== undefined) {
    headers[AUTHORIZATION_HEADER] = `Bearer ${oboAccessToken}`;
  }

  log.info({
    msg: 'Prepared proxy request headers',
    tab_id,
    trace_id,
    span_id,
    data: { contentType: headers['content-type'], contentLength: headers['content-length'] },
  });

  return headers;
};

const exists = (value: string): boolean => value.length !== 0;

const omit = <T extends Record<string, unknown>, K extends keyof T>(obj: T, key: K): Omit<T, K> => {
  const { [key]: _, ...rest } = obj;

  return rest;
};
