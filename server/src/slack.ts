import { slack } from './config/config';
import { ENVIRONMENT, isDeployed } from './config/env';
import { getLogger } from './logger';

const log = getLogger('slack');

export enum EmojiIcons {
  StartStruck = ':star-struck:',
  Scream = ':scream:',
}

const { url, channel, messagePrefix } = slack;
const isConfigured = typeof url === 'string' && url.length !== 0;

export const sendToSlack = async (message: string, icon_emoji: EmojiIcons) => {
  const text = `[${ENVIRONMENT}] ${messagePrefix} ${message}`;

  if (!isDeployed || !isConfigured) {
    return;
  }

  const body = JSON.stringify({
    channel,
    text,
    icon_emoji,
  });

  return fetch(url, {
    method: 'POST',
    body,
  }).catch((error: unknown) => {
    const msg = `Failed to send message to Slack. Message: '${text}'`;

    // Don't log the error object since it contains webhook URL
    if (error instanceof Error) {
      log.error({ msg: scrubWebhookUrl(`${msg} - ${error.name}: ${error.message}`) });
    }

    log.error({ msg: scrubWebhookUrl(msg) });
  });
};

const URL_REGEXP = new RegExp(url, 'g');

const scrubWebhookUrl = (errorText: string) => errorText.replace(URL_REGEXP, '[REDACTED]');
