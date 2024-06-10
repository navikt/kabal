import { getLogger } from './logger';
import { resetClientsAndUniqueUsersMetrics } from './routes/version/version';
import { EmojiIcons, sendToSlack } from './slack';
import { isDeployed } from '@app/config/env';
import { getAzureADClient } from '@app/auth/get-auth-client';
import { setIsReady } from '@app/config/config';

const log = getLogger('init');

export const init = async () => {
  try {
    if (isDeployed) {
      await getAzureADClient();
    }

    setIsReady();
  } catch (e) {
    await resetClientsAndUniqueUsersMetrics();

    if (e instanceof Error) {
      log.error({ error: e, msg: 'Server crashed' });
      await sendToSlack(`Server crashed: ${e.message}`, EmojiIcons.Scream);
    } else if (typeof e === 'string' || typeof e === 'number') {
      const msg = `Server crashed: ${JSON.stringify(e)}`;
      log.error({ msg });
      await sendToSlack(msg, EmojiIcons.Scream);
    }
    process.exit(1);
  }
};
