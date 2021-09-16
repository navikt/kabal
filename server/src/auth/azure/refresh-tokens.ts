import { Client } from 'openid-client';
import { deleteFromRedis, saveSessionData } from '../../redis';

export const refreshAndSaveTokens = async (authClient: Client, session: string, current_refresh_token: string) => {
  const { access_token, refresh_token } = await authClient.refresh(current_refresh_token);
  if (typeof access_token === 'undefined' || typeof refresh_token === 'undefined') {
    await deleteFromRedis(session);
    throw new Error('Failed to refresh tokens. No error.');
  }
  await saveSessionData(session, { access_token, refresh_token });
  return access_token;
};
