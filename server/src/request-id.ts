import { randomUUID } from 'node:crypto';
import { RequestHandler } from 'express';

export const ensureNavCallId: RequestHandler = (req, res, next) => {
  const navCallId = req.headers['nav-callid'];

  if (typeof navCallId === 'undefined' || navCallId.length === 0) {
    req.headers['nav-callid'] =
      req.headers['x-nav-callid'] ?? req.headers['x-request-id'] ?? randomUUID().replaceAll('-', '');
  }

  next();
};
