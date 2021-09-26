import { RequestHandler } from 'express';
import { applicationDomain, isDeployedToProd } from './config/env';

// const METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
// const HEADERS = 'Origin, Content-Type, Accept';
// const VARY = 'Origin, Access-Control-Request-Method, Access-Control-Request-Headers';

export const cors = (): RequestHandler => {
  if (isDeployedToProd) {
    return (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', applicationDomain);
      // res.setHeader('Access-Control-Allow-Methods', METHODS);
      // res.setHeader('Access-Control-Allow-Headers', HEADERS);
      // res.setHeader('Vary', VARY);
      return next();
    };
  }
  return (req, res, next) => {
    const host = req.hostname === 'localhost' ? 'http://localhost' : applicationDomain;
    res.setHeader('Access-Control-Allow-Origin', host);
    // res.setHeader('Access-Control-Allow-Methods', METHODS);
    // res.setHeader('Access-Control-Allow-Headers', HEADERS);
    // res.setHeader('Vary', VARY);
    return next();
  };
};
