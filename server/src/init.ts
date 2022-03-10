import { Express } from 'express';
import { serverConfig } from './config/server-config';
import { getAzureClient } from './auth/azure/client';
import { EmojiIcons, sendToSlack } from './slack';
import { setupProxy } from './routes/setup-proxy';
import { setupStaticRoutes } from './routes/static-routes';
import { authMiddleware } from './auth/auth-middleware';
import { callbackPath } from './config/azure-config';
import { callbackHandler } from './auth/callback-handler';
import { logoutHandler } from './auth/logout-handler';
import { guardMiddleware } from './auth/guard-middleware';
import { setupVersionRoute } from './routes/version';

const PORT = serverConfig.port;

export const init = async (server: Express) => {
  try {
    const authClient = await getAzureClient();
    server.use(setupVersionRoute());
    server.get(callbackPath, callbackHandler(authClient));
    server.get('/logout', logoutHandler(authClient));
    server.use(['/api', '/assets', '/bundle.js', '/favicon.ico'], guardMiddleware(authClient));
    server.use(authMiddleware(authClient));
    server.use(setupProxy(authClient));
    server.use(setupStaticRoutes());
    server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  } catch (e) {
    if (e instanceof Error || typeof e === 'string' || typeof e === 'number') {
      await sendToSlack(`Server crashed: ${e}`, EmojiIcons.Scream);
    } else {
      await sendToSlack(`Server crashed: ${JSON.stringify(e)}`, EmojiIcons.Scream);
    }
    process.exit(1);
  }
};
