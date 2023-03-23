import fs from 'fs';
import express from 'express';
import { VERSION, frontendDistDirectoryPath } from '@app/config/config';
import { ENVIRONMENT } from '@app/config/env';

const router = express.Router();

const indexFile = fs
  .readFileSync(`${frontendDistDirectoryPath}/index.html`, 'utf8')
  .replace('{{ENVIRONMENT}}', ENVIRONMENT)
  .replace('{{VERSION}}', VERSION);

const sendIndexFile = (req: express.Request, res: express.Response) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(indexFile);
};

export const setupStaticRoutes = () => {
  router.get('/', sendIndexFile);

  router.use(express.static(frontendDistDirectoryPath, { index: false }));

  router.get('*', sendIndexFile);

  return router;
};
