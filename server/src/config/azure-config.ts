import jose from 'jose';
import { AuthorizationParameters, ClientMetadata } from 'openid-client';
import { applicationDomain } from './env';
import { requiredEnvString, requiredEnvUrl } from './env-var';

export const callbackPath = '/oauth2/callback';
export const callbackUrl = applicationDomain + callbackPath;

export const discovery_url = requiredEnvUrl('AZURE_APP_WELL_KNOWN_URL');

export const client_jwks = jose.JWKS.asKeyStore(JSON.parse(requiredEnvString('AZURE_APP_JWKS'))).toJWKS(true);
export const client_id = requiredEnvString('AZURE_APP_CLIENT_ID');
const client_secret = requiredEnvString('AZURE_APP_CLIENT_SECRET');

interface AzureClientMetadata extends ClientMetadata {
  client_id: string;
  client_secret: string;
  token_endpoint_auth_method: 'private_key_jwt';
  token_endpoint_auth_signing_alg: 'RS256';
  redirect_uris: string[];
  response_types: ['code'];
}

export const azureClientMetadata: AzureClientMetadata = {
  client_id,
  client_secret,
  token_endpoint_auth_method: 'private_key_jwt',
  token_endpoint_auth_signing_alg: 'RS256',
  redirect_uris: [callbackUrl],
  response_types: ['code'],
};

interface AuthParams extends AuthorizationParameters {
  client_id: string;
  redirect_uri: string;
  response_type: 'code';
  response_mode: 'query';
  scope: string;
  code_challenge_method: 'S256';
}

export const azureAdAuthParams: AuthParams = {
  client_id,
  redirect_uri: callbackUrl,
  response_type: 'code',
  response_mode: 'query',
  scope: `offline_access openid ${client_id}/.default`,
  code_challenge_method: 'S256',
};
