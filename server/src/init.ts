import { Express } from 'express';
import { authMiddleware } from './auth/auth-middleware';
import { getAzureClient } from './auth/azure/client';
import { callbackHandler } from './auth/callback-handler';
import { guardMiddleware } from './auth/guard-middleware';
import { logoutHandler } from './auth/logout-handler';
import { callbackPath } from './config/azure-config';
import { serverConfig } from './config/server-config';
import { setupProxy } from './routes/setup-proxy';
import { setupStaticRoutes } from './routes/static-routes';
import { setupVersionRoute } from './routes/version';
import { EmojiIcons, sendToSlack } from './slack';

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
    server.listen(PORT, () => console.info(`Listening on port ${PORT}`));
  } catch (e) {
    if (e instanceof Error) {
      await sendToSlack(`Server crashed: ${e.message}`, EmojiIcons.Scream);
    } else {
      await sendToSlack(`Server crashed: ${JSON.stringify(e)}`, EmojiIcons.Scream);
    }
    process.exit(1);
  }
};
