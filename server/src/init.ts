import { getAzureADClient } from '@app/auth/get-auth-client';
import { isDeployed } from '@app/config/env';
import { formatDuration, getDuration } from '@app/helpers/duration';
import { getLogger } from '@app/logger';
import { EmojiIcons, sendToSlack } from '@app/slack';

const log = getLogger('init');

export const init = async () => {
  try {
    if (isDeployed) {
      const start = performance.now();

      await getAzureADClient();

      const time = getDuration(start);
      log.info({ msg: `Azure AD client initialized in ${formatDuration(time)}`, data: { time } });
    }
  } catch (e) {
    if (e instanceof Error) {
      log.error({ error: e, msg: 'Server crashed' });
      await sendToSlack(`Server crashed: ${e.message}`, EmojiIcons.Broken);
    } else if (typeof e === 'string' || typeof e === 'number') {
      const msg = `Server crashed: ${JSON.stringify(e)}`;
      log.error({ msg });
      await sendToSlack(msg, EmojiIcons.Broken);
    }
    process.exit(1);
  }
};
