import { optionalEnvString, requiredEnvNumber, requiredEnvString } from './env-var';

export const serverConfig = {
  // should be equivalent to the URL this application is hosted on for correct CORS origin header.
  host: requiredEnvString('HOST', '0.0.0.0'),
  cluster: requiredEnvString('NAIS_CLUSTER_NAME'),
  // Port for your application.
  port: requiredEnvNumber('PORT', 8080),
  // Optional, only set if requests to Azure AD must be performed through a corporate proxy (i.e. traffic to login.microsoftonline.com is blocked by the firewall)
  proxy: optionalEnvString('HTTP_PROXY'),
  // Should be set to a random key of significant length for signing session ID cookies.
  // This is configured as a Kubernetes secret.
  sessionKey: requiredEnvString('SESS_KEY'),
  // Session cookie name.
  cookieName: 'kabal-session',
  // Session cookie lifespan in milliseconds.
  // Not the same as the "Max-Age" attribute, but milliseconds used to calculate the "Expires" attribute.
  sessionTime: 24 * 60 * 60 * 1000,
};
