import type { FastifyRequest } from 'fastify';
import { ApiClientEnum, PROXY_VERSION } from '@/config/config';
import { isDeployed } from '@/config/env';
import { CLIENT_VERSION_HEADER, PROXY_VERSION_HEADER, TAB_ID_HEADER } from '@/headers';

type GetHeadersFn = (req: FastifyRequest) => Promise<Record<string, string | string[]>>;

const getDeployedHeaders: GetHeadersFn = async (req) => {
  const { client_version, tab_id } = req;

  return {
    Authorization: `Bearer ${await req.getOboAccessToken(ApiClientEnum.KABAL_API)}`,
    Accept: 'application/json',
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
  'content-length',
];

const getLocalHeaders: GetHeadersFn = async (req) => {
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
