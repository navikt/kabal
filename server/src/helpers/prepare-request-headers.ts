import { PROXY_VERSION } from '@app/config/config';
import { DEV_DOMAIN, isDeployed } from '@app/config/env';
import {
  AUTHORIZATION_HEADER,
  AZURE_AD_TOKEN_HEADER,
  CLIENT_VERSION_HEADER,
  PROXY_VERSION_HEADER,
  TAB_ID_HEADER,
} from '@app/headers';
import { FastifyRequest, RawServerBase, RequestGenericInterface } from 'fastify';
import { IncomingHttpHeaders as Http2IncomingHttpHeaders } from 'http2';
import { IncomingHttpHeaders } from 'http';

type Headers = Http2IncomingHttpHeaders | IncomingHttpHeaders;

export const prepareRequestHeaders = (
  req: FastifyRequest<RequestGenericInterface, RawServerBase>,
  incomingHeaders: Headers,
  appName: string,
): Headers => {
  const { traceparent, clientVersion, tabId, oboAccessToken, accessToken } = req;

  const headers: Record<string, string | string[]> = {
    // Default headers
    accept: 'application/json',

    // Incoming request headers
    ...incomingHeaders,

    // Proxy request headers
    host: isDeployed ? appName : DEV_DOMAIN,
    traceparent,
    [PROXY_VERSION_HEADER]: PROXY_VERSION,
  };

  if (exists(clientVersion)) {
    headers[CLIENT_VERSION_HEADER] = clientVersion;
  }

  if (exists(tabId)) {
    headers[TAB_ID_HEADER] = tabId;
  }

  if (exists(oboAccessToken)) {
    headers[AUTHORIZATION_HEADER] = `Bearer ${oboAccessToken}`;
  }

  if (exists(accessToken)) {
    headers[AZURE_AD_TOKEN_HEADER] = accessToken;
  }

  return headers;
};

const exists = (value: string): boolean => value.length !== 0;
