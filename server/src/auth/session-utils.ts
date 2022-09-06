import crypto from 'crypto';
import { Request, Response } from 'express';
import { isDeployedToProd } from '../config/env';
import { serverConfig } from '../config/server-config';
import { getLogger } from '../logger';

const log = getLogger('auth');

export const ensureSession = (req: Request, res: Response): [string, string] => {
  const existingSession = getSessionIdAndSignature(req);

  if (existingSession !== null) {
    return existingSession;
  }
  const [sessionId, signature] = generateSessionIdAndSignature();
  setSessionCookie(res, sessionId, signature);

  return [sessionId, signature];
};

export const getSessionIdAndSignature = (req: Request): [string, string] | null => {
  const sessionCookie: unknown = req.cookies[serverConfig.cookieName];

  if (typeof sessionCookie !== 'string' || sessionCookie.length === 0) {
    return null;
  }

  const [sessionId, signature, ...rest] = sessionCookie.split('.');

  if (typeof sessionId !== 'string' || typeof signature !== 'string' || rest.length !== 0) {
    return null;
  }

  if (validateSessionSignature(sessionId, signature)) {
    return [sessionId, signature];
  }

  log.warn({ msg: `Session signature invalid for session "${sessionId}.${signature}".` });

  return null;
};

const SESSION_ENCODING: BufferEncoding = 'hex';
const HMAC_ALGORITHM = 'SHA256';

const validateSessionSignature = (session: string, signature: string) => {
  const hmac = crypto.createHmac(HMAC_ALGORITHM, serverConfig.sessionKey);
  const sessionBytes = Buffer.from(session, SESSION_ENCODING);
  const actualSignature = Buffer.from(signature, SESSION_ENCODING);
  const expectedSignature = hmac.update(sessionBytes).digest();

  if (expectedSignature.length !== actualSignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedSignature, actualSignature);
};

const SESSION_BYTE_SIZE = 64;

export const setSessionCookie = (res: Response, sessionId: string, signature: string): [string, string] => {
  res.cookie(serverConfig.cookieName, `${sessionId}.${signature}`, {
    maxAge: serverConfig.sessionTime,
    path: '/',
    httpOnly: true,
    sameSite: isDeployedToProd ? 'lax' : 'none', // Strict breaks Azure login flow because of redirect (third-party init).
    secure: true,
  });

  return [sessionId, signature];
};

export const generateSessionIdAndSignature = (): [string, string] => {
  const sessionBytes = crypto.randomBytes(SESSION_BYTE_SIZE);
  const sessionId = sessionBytes.toString(SESSION_ENCODING);
  const hmac = crypto.createHmac(HMAC_ALGORITHM, serverConfig.sessionKey);
  const signature = hmac.update(sessionBytes).digest(SESSION_ENCODING);

  return [sessionId, signature];
};
