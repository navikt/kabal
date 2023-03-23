import { Router } from 'express';
import { VERSION } from '@app/config/config';

const router = Router();

const HEADERS = {
  'Content-Type': 'text/event-stream',
  Connection: 'keep-alive',
  'Cache-Control': 'no-cache',
};

export const setupVersionRoute = () => {
  router.get('/version', (req, res) => {
    if (req.headers.accept !== 'text/event-stream') {
      res.status(307).redirect('/');

      return;
    }
    res.writeHead(200, HEADERS);
    res.write('retry: 0\n');
    res.write(`data: ${VERSION}\n\n`);
  });

  return router;
};
