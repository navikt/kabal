import { Request } from 'express';

export const getClientVersion = (req: Request): string | undefined =>
  'version' in req.query && typeof req.query['version'] === 'string' ? req.query['version'] : undefined;
