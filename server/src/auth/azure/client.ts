import { Issuer } from 'openid-client';
import { azureClientMetadata, client_jwks, discovery_url } from '../../config/azure-config';

export const getAzureClient = async () => {
  try {
    const azureIssuer = await Issuer.discover(discovery_url);
    return new azureIssuer.Client(azureClientMetadata, client_jwks);
  } catch (e) {
    throw new Error(`Failed to discover Azure AD OpenID issuer. ${e}`);
  }
};
