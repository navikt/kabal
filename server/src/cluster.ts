import { isLocal } from '@app/config/env';
import { getLogger } from '@app/logger';
import { startServer } from '@app/server';
import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const log = getLogger('cluster');

if (isLocal) {
  startServer();
  log.info({ msg: 'Dev server started' });
} else {
  const numCPUs = availableParallelism(); // Number of CPU cores

  if (cluster.isPrimary) {
    log.info({ msg: `Primary ${process.pid} is running` });

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      log.info({
        msg: `Worker ${worker.process.pid} died. Code: ${code}. Signal: ${signal}`,
        data: { worker: worker.process.pid, code, signal },
      });
    });
  } else {
    startServer();

    log.info({ msg: `Worker ${process.pid} started` });
  }
}
