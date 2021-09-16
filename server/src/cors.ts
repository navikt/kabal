import { RequestHandler } from 'express';
import { applicationDomain } from './config/env';

export const cors: RequestHandler = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', applicationDomain);
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, X-Requested-With');
  return next();
};
