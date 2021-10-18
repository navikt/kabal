import fetch from 'node-fetch';
import { slack } from './config/config';
import { environmentName, isDeployed } from './config/env';

export enum EmojiIcons {
  StartStruck = ':star-struck:',
  Scream = ':scream:',
}

const { url, channel, messagePrefix } = slack;
const isConfigured = typeof url === 'string' && url.length !== 0;

export const sendToSlack = async (message: string, icon_emoji: EmojiIcons) => {
  const text = `[${environmentName}] ${messagePrefix} ${message}`;

  console.error(text);

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
  }).catch((err) => {
    console.error(`Failed to send message to Slack. ${err}. Message: '${text}'`);
  });
};
