import { optionalEnvString, requiredEnvString } from '@app/config/env-var';
import { ENVIRONMENT, isDeployed, isLocal } from '@app/config/env';
import { getLogger } from '@app/logger';

const log = getLogger('slack');

export enum EmojiIcons {
  Tada = ':tada:',
  LoadingDots = ':loading-dots:',
  Broken = ':broken:',
  Collision = ':collision:',
}

const url = optionalEnvString('SLACK_URL');
const channel = '#klage-notifications';
const messagePrefix = `${requiredEnvString('NAIS_APP_NAME', 'kabal-frontend')} frontend NodeJS -`;
const isConfigured = url !== undefined && url.length !== 0;

export const sendToSlack = async (message: string, icon_emoji: EmojiIcons) => {
  const text = `[${ENVIRONMENT}] ${messagePrefix} ${message}`;

  if (!isDeployed || !isConfigured) {
    return;
  }

  const body = JSON.stringify({ channel, text, icon_emoji });

  if (isLocal) {
    log.info({ msg: `Sending message to Slack: ${text}` });

    return;
  }

  try {
    await fetch(url, { method: 'POST', body });
  } catch (error) {
    const msg = `Failed to send message to Slack. Message: '${text}'`;

    // Don't log the error object since it contains webhook URL
    if (error instanceof Error) {
      log.error({ msg: scrubWebhookUrl(`${msg} - ${error.name}: ${error.message}`) });
    }

    log.error({ msg: scrubWebhookUrl(msg) });
  }
};

const URL_REGEXP = url === undefined ? '' : new RegExp(url, 'g');

const scrubWebhookUrl = (errorText: string) => errorText.replace(URL_REGEXP, '[REDACTED]');
