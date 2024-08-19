import { Server } from '@hocuspocus/server';
import { getLogger } from '@app/logger';
import { isConnectionContext } from '@app/plugins/crdt/context';
import { isDeployed } from '@app/config/env';
import { getRedisExtension } from '@app/plugins/crdt/redis';
import { isNotNull } from '@app/functions/guards';
import { getApiExtension } from '@app/plugins/crdt/api/extension';

const log = getLogger('collaboration');

export const collaborationServer = Server.configure({
  onConnect: async ({ context }) => {
    if (isConnectionContext(context)) {
      const { behandlingId, dokumentId, req } = context;
      log.info({
        msg: `Collaboration connection established for ${req.navIdent}!`, // req.navIdent is not defined locally.
        data: { behandlingId, dokumentId },
      });
    } else {
      log.error({ msg: 'Tried to establish collaboration connection without context' });
      throw new Error('Invalid context');
    }
  },

  onDisconnect: async ({ context }) => {
    if (isConnectionContext(context)) {
      const { behandlingId, dokumentId, req } = context;
      log.info({
        msg: `Collaboration connection closed for ${req.navIdent}!`, // req.navIdent is not defined locally.
        data: { behandlingId, dokumentId },
      });
    } else {
      log.error({ msg: 'Tried to close collaboration connection without context' });
      throw new Error('Invalid context');
    }
  },

  extensions: isDeployed ? [getRedisExtension(), getApiExtension()].filter(isNotNull) : [getApiExtension()],
});
