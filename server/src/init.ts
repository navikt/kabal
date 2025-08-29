import { getAzureADClient } from '@app/auth/get-auth-client';
import { isDeployed } from '@app/config/env';
import { SMART_DOCUMENT_WRITE_ACCESS } from '@app/document-access/service';
import { formatDuration, getDuration } from '@app/helpers/duration';
import { getLogger } from '@app/logger';
import { EmojiIcons, sendToSlack } from '@app/slack';

const log = getLogger('init');

export const init = async () => {
  try {
    if (isDeployed) {
      await Promise.all([
        logTimedAsyncFn(async () => await getAzureADClient(), 'Azure AD client'),
        logTimedAsyncFn(async () => await SMART_DOCUMENT_WRITE_ACCESS.init(), 'Smart Document Write Access'),
      ]);
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

const logTimedAsyncFn = async (fn: () => Promise<unknown>, name: string) => {
  const start = performance.now();

  await fn();

  const duration = getDuration(start);

  log.info({ msg: `${name} initialized in ${formatDuration(duration)}`, data: { time: duration } });
};
