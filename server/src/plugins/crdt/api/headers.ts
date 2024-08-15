import { FastifyRequest } from 'fastify';
import { AZURE_AD_TOKEN_HEADER, CLIENT_VERSION_HEADER, PROXY_VERSION_HEADER, TAB_ID_HEADER } from '@app/headers';
import { PROXY_VERSION } from '@app/config/config';
import { isDeployed } from '@app/config/env';

type GetHeadersFn = (req: FastifyRequest) => Record<string, string | string[]>;

const getDeployedHeaders: GetHeadersFn = (req) => {
  const { accessToken, client_version, tab_id } = req;

  return {
    Authorization: `Bearer ${req.getOboAccessToken('kabal-api')}`,
    Accept: 'application/json',
    traceparent: req.traceparent,
    [AZURE_AD_TOKEN_HEADER]: accessToken,
    [PROXY_VERSION_HEADER]: PROXY_VERSION,
    [CLIENT_VERSION_HEADER]: client_version,
    [TAB_ID_HEADER]: tab_id,
  };
};

const IGNORED_HEADERS = [
  'host',
  'origin',
  'connection',
  'upgrade',
  'sec-websocket-version',
  'sec-websocket-extensions',
  'sec-websocket-version',
  'sec-websocket-key',
];

const getLocalHeaders: GetHeadersFn = (req) => {
  const headers: Record<string, string | string[]> = {
    host: 'kabal.intern.dev.nav.no',
    origin: 'https://kabal.intern.dev.nav.no',
  };

  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined && !IGNORED_HEADERS.includes(key)) {
      headers[key] = value;
    }
  }

  return headers;
};

export const getHeaders: GetHeadersFn = isDeployed ? getDeployedHeaders : getLocalHeaders;
