import express from 'express';
import { frontendDistDirectoryPath } from '../config/config';

const router = express.Router();

export const setupStaticRoutes = () => {
  router.get('/', (req, res) => {
    res.status(200).sendFile('index.html', { root: frontendDistDirectoryPath });
  });

  router.use(express.static(frontendDistDirectoryPath, { index: false }));

  router.get('*', (req, res) => {
    res.status(200).sendFile('index.html', { root: frontendDistDirectoryPath });
  });

  return router;
};
