import { ENVIRONMENT, isLocal } from '@app/config/env';
import { optionalEnvString, requiredEnvString } from '@app/config/env-var';
import { getLogger } from '@app/logger';

const log = getLogger('slack');

export enum EmojiIcons {
  Tada = ':tada:',
  LoadingDots = ':loading-dots:',
  Broken = ':broken:',
  Collision = ':collision:',
  Kabal = ':kabal:',
}

const url = optionalEnvString('SLACK_URL');
const channel = '#klage-notifications';
const messagePrefix = `${requiredEnvString('NAIS_APP_NAME', 'kabal-frontend')} frontend NodeJS -`;
const isConfigured = url !== undefined && url.length !== 0;

export const sendToSlack = async (message: string, icon_emoji: EmojiIcons): Promise<boolean> => {
  const text = `[${ENVIRONMENT}] ${messagePrefix} ${message}`;

  if (isLocal) {
    log.info({ msg: `Sending message to Slack: ${text}` });

    return true;
  }

  if (!isConfigured) {
    return true;
  }

  const body = JSON.stringify({ channel, text, icon_emoji });

  try {
    const res = await fetch(url, { method: 'POST', body });

    if (!res.ok) {
      throw new Error(`Slack responded with status code ${res.status}`);
    }

    return true;
  } catch (error) {
    const msg = `Failed to send message to Slack. Message: '${text}'`;

    // Don't log the error object since it contains webhook URL
    if (error instanceof Error) {
      log.error({ msg: scrubWebhookUrl(`${msg} - ${error.name}: ${error.message}`) });
    }

    log.error({ msg: scrubWebhookUrl(msg) });

    return false;
  }
};

const URL_REGEXP = url === undefined ? '' : new RegExp(url, 'g');

const scrubWebhookUrl = (errorText: string) => errorText.replace(URL_REGEXP, '[REDACTED]');
