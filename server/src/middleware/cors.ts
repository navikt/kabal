import { cors } from 'hono/cors';
import { URL } from '@app/config/env';

export const corsMiddleware = cors({
  credentials: true,
  allowMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowHeaders: [
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
  origin: URL,
});
