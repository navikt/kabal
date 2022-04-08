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

export const init = async (app: Express) => {
  try {
    const authClient = await getAzureClient();
    app.use(setupVersionRoute());
    app.get(callbackPath, callbackHandler(authClient));
    app.get('/logout', logoutHandler(authClient));
    app.use(['/api', '/assets', '/bundle.js', '/favicon.ico'], guardMiddleware(authClient));
    app.use(authMiddleware(authClient));
    const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    app.use(setupProxy(authClient, server));
    app.use(setupStaticRoutes());
  } catch (e) {
    if (e instanceof Error || typeof e === 'string' || typeof e === 'number') {
      await sendToSlack(`Server crashed: ${e}`, EmojiIcons.Scream);
    } else {
      await sendToSlack(`Server crashed: ${JSON.stringify(e)}`, EmojiIcons.Scream);
    }
    process.exit(1);
  }
};
