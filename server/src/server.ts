import cors from 'cors';
import express from 'express';
import { ensureNavCallId } from '@app/request-id';
import { DOMAIN, isDeployed, isDeployedToProd } from './config/env';
import { init } from './init';
import { getLogger, httpLoggingMiddleware } from './logger';
import { processErrors } from './process-errors';
import { metricsMiddleware } from './prometheus/middleware';
import { EmojiIcons, sendToSlack } from './slack';

processErrors();

const log = getLogger('server');

if (isDeployed) {
  log.info({ msg: 'Started!' });

  sendToSlack('Starting...', EmojiIcons.StartStruck);
}

const server = express();

// Add the prometheus middleware to all routes
server.use(metricsMiddleware);

server.use(ensureNavCallId);

server.use(httpLoggingMiddleware);

server.set('trust proxy', true);
server.disable('x-powered-by');
server.set('query parser', 'simple');

server.use(
  cors({
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: [
      'Accept-Language',
      'Accept',
      'Cache-Control',
      'Connection',
      'Content-Type',
      'Cookie',
      'DNT',
      'Host',
      'Origin',
      'Pragma',
      'Referer',
      'Sec-Fetch-Dest',
      'Sec-Fetch-Mode',
      'Sec-Fetch-Site',
      'User-Agent',
      'X-Forwarded-For',
      'X-Forwarded-Host',
      'X-Forwarded-Proto',
      'X-Requested-With',
    ],
    origin: isDeployedToProd ? DOMAIN : [DOMAIN, /https?:\/\/localhost:\d{4,}/],
  })
);

server.get('/isAlive', (req, res) => res.status(200).send('Alive'));
server.get('/isReady', (req, res) => res.status(200).send('Ready'));

init(server);
