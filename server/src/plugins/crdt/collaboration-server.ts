import { Server } from '@hocuspocus/server';
import { getLogger } from '@app/logger';
import { isConnectionContext } from '@app/plugins/crdt/context';
import { isDeployed } from '@app/config/env';
import { getRedisExtension } from '@app/plugins/crdt/redis';
import { isNotNull } from '@app/functions/guards';
import { getApiExtension } from '@app/plugins/crdt/api/extension';
import { slateNodesToInsertDelta } from '@slate-yjs/core';
import * as Y from 'yjs';
import { getDocument } from '@app/plugins/crdt/get-document';

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

    if (document.isEmpty('content')) {
      log.info({ msg: 'Loading document from API in onLoadDocument' });
      const res = await getDocument(context.req, context.behandlingId, context.dokumentId);
      const insertDelta = slateNodesToInsertDelta(res.content);
      const sharedRoot = document.get('content', Y.XmlText) as unknown as Y.XmlText;
      sharedRoot.applyDelta(insertDelta);
    } else {
      log.info({ msg: 'Document already loaded in onLoadDocument' });
    }

    log.info({ msg: 'Document loaded in onLoadDocument' });

    return document;
  },

  extensions: isDeployed ? [getRedisExtension(), getApiExtension()].filter(isNotNull) : [getApiExtension()],
});
