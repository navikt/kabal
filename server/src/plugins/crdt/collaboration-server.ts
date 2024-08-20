import { Server } from '@hocuspocus/server';
import { getLogger } from '@app/logger';
import { isConnectionContext } from '@app/plugins/crdt/context';
import { isDeployed } from '@app/config/env';
import { getRedisExtension } from '@app/plugins/crdt/redis';
import { isNotNull } from '@app/functions/guards';
import { getDocument } from '@app/plugins/crdt/api/get-document';
import { applyUpdateV2 } from 'yjs';
import { setDocument } from '@app/plugins/crdt/api/set-document';

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

  onLoadDocument: async ({ context, document }) => {
    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to load document without context' });
      throw new Error('Invalid context');
    }

    if (!document.isEmpty('content')) {
      log.info({ msg: 'Document already loaded' });

      return document;
    }

    const { behandlingId, dokumentId, req } = context;

    const res = await getDocument(req, behandlingId, dokumentId);

    log.info({ msg: 'Loaded state/update', data: { behandlingId, dokumentId } });

    const update = new Uint8Array(Buffer.from(res.data, 'base64url'));

    applyUpdateV2(document, update);

    log.info({ msg: 'Loaded state/update applied', data: { behandlingId, dokumentId } });
  },

  onStoreDocument: async ({ context, document }) => {
    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to store document without context' });
      throw new Error('Invalid context');
    }

    const { behandlingId, dokumentId, req } = context;

    await setDocument(req, document, behandlingId, dokumentId);

    log.info({ msg: 'Saved document to database', data: { behandlingId, dokumentId } });
  },

  extensions: isDeployed ? [getRedisExtension()].filter(isNotNull) : [],
});
