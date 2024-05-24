import { Server } from '@hocuspocus/server';
import { getLogger } from '@app/logger';

const log = getLogger('websocket');

export const wsServer = Server.configure({
  onConnect: async () => {
    log.info({ msg: 'Connected!' });
  },
  onStoreDocument: async (doc) => {
    log.info({ msg: 'Store document', data: JSON.stringify(doc) });
  },
  extensions: [],
});
