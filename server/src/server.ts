import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { applicationDomain, isDeployed, isDeployedToProd } from './config/env';
import { EmojiIcons, sendToSlack } from './slack';
import { init } from './init';
import { processErrors } from './process-errors';

processErrors();

if (isDeployed) {
  sendToSlack('Starting...', EmojiIcons.StartStruck);
}

const server = express();

server.set('trust proxy', true);
server.disable('x-powered-by');

server.use(cookieParser());

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
    origin: isDeployedToProd ? applicationDomain : [applicationDomain, /https?:\/\/localhost:\d{4,}/],
  })
);

server.get('/isAlive', (req, res) => res.status(200).send('Alive'));
server.get('/isReady', (req, res) => res.status(200).send('Ready'));

// morganBody(server, {
//   noColors: true,
//   prettify: false,
//   includeNewLine: false,
//   logReqUserAgent: false,
//   logRequestBody: false, // så slipper vi å se tokens i loggen
//   maxBodyLength: 5000,
//   logIP: false,
// });

init(server);
