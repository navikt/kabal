import crypto from 'crypto';
import { Request, Response } from 'express';
import { isDeployed, isDeployedToProd } from '../config/env';
import { serverConfig } from '../config/server-config';

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
  const sessionCookie = req.cookies[serverConfig.cookieName];
  console.debug(`Session cookie '${sessionCookie}' - ${req.originalUrl}`);
  if (typeof sessionCookie !== 'string' || sessionCookie.length === 0) {
    return null;
  }

  const [session, signature, ...rest] = sessionCookie.split('.');

  if (typeof session !== 'string' || typeof signature !== 'string' || rest.length !== 0) {
    return null;
  }

  if (validateSessionSignature(session, signature)) {
    return [session, signature];
  }
  console.debug(`Session cookie signature not valid: '${session}.${signature}'.`);

  return null;
};

const SESSION_ENCODING: BufferEncoding = 'hex';
const HMAC_ALGORITHM = 'SHA256';

export const validateSessionSignature = (session: string, signature: string) => {
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
    sameSite: isDeployedToProd ? 'strict' : 'lax',
    secure: isDeployedToProd,
  });
  return [sessionId, signature];
};

export const generateSessionIdAndSignature = (): [string, string] => {
  const sessionBytes = crypto.randomBytes(SESSION_BYTE_SIZE);
  const session = sessionBytes.toString(SESSION_ENCODING);
  const hmac = crypto.createHmac(HMAC_ALGORITHM, serverConfig.sessionKey);
  const signature = hmac.update(sessionBytes).digest(SESSION_ENCODING);

  return [session, signature];
};
