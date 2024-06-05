import { PROXY_VERSION } from '@app/config/config';
import { DEV_DOMAIN, isDeployed } from '@app/config/env';
import {
  AUTHORIZATION_HEADER,
  AZURE_AD_TOKEN_HEADER,
  CLIENT_VERSION_HEADER,
  PROXY_VERSION_HEADER,
  TAB_ID_HEADER,
} from '@app/headers';
import { Context } from 'hono';

export const prepareRequestHeaders = (context: Context, appName: string): Record<string, string> => {
  const { traceparent, clientVersion, tabId, oboAccessToken, accessToken } = context.var;

  const headers: Record<string, string> = {
    // Default headers
    accept: 'application/json',

    // Incoming request headers
    ...context.req.header(),

    // Proxy request headers
    host: isDeployed ? appName : DEV_DOMAIN,
    traceparent,
    [PROXY_VERSION_HEADER]: PROXY_VERSION,
  };

  if (clientVersion !== undefined) {
    headers[CLIENT_VERSION_HEADER] = clientVersion;
  }

  if (tabId !== undefined) {
    headers[TAB_ID_HEADER] = tabId;
  }

  if (oboAccessToken !== undefined) {
    headers[AUTHORIZATION_HEADER] = `Bearer ${oboAccessToken}`;
  }

  if (accessToken !== undefined) {
    headers[AZURE_AD_TOKEN_HEADER] = accessToken;
  }

  return headers;
};
