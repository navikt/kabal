import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { isDeployed } from './config/env';
import { EmojiIcons, sendToSlack } from './slack';
import { init } from './init';
import { processErrors } from './process-errors';

processErrors();

if (isDeployed) {
  sendToSlack('Starting...', EmojiIcons.StartStruck);
}

const server = express();

server.disable('x-powered-by');

server.use(cookieParser());

server.use(cors());

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
