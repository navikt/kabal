import { isDeployed } from '@app/config/env';
import { isNotNull } from '@app/functions/guards';
import { Level, getLogger } from '@app/logger';
import { getDocument } from '@app/plugins/crdt/api/get-document';
import { setDocument } from '@app/plugins/crdt/api/set-document';
import { ConnectionContext, isConnectionContext } from '@app/plugins/crdt/context';
import { getRedisExtension } from '@app/plugins/crdt/redis';
import { Server } from '@hocuspocus/server';
import { applyUpdateV2 } from 'yjs';

const log = getLogger('collaboration');

const logContext = (msg: string, context: ConnectionContext, level: Level = 'info') => {
  log[level]({
    msg,
    trace_id: context.req.trace_id,
    span_id: context.req.span_id,
    tab_id: context.req.tab_id,
    client_version: context.req.client_version,
    data: { behandlingId: context.behandlingId, dokumentId: context.dokumentId },
  });
};

export const collaborationServer = Server.configure({
  onConnect: async ({ context }) => {
    if (isConnectionContext(context)) {
      // req.navIdent is not defined locally.
      logContext(`Collaboration connection established for ${context.req.navIdent}!`, context);
    } else {
      log.error({ msg: 'Tried to establish collaboration connection without context' });
      throw new Error('Invalid context');
    }
  },

  onDisconnect: async ({ context }) => {
    if (isConnectionContext(context)) {
      // req.navIdent is not defined locally.
      logContext(`Collaboration connection closed for ${context.req.navIdent}!`, context);
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

    const { behandlingId, dokumentId, req } = context;

    if (!document.isEmpty('content')) {
      logContext('Document already loaded', context);

      return document;
    }

    const res = await getDocument(req, behandlingId, dokumentId);

    logContext('Loaded state/update', context);

    const update = new Uint8Array(Buffer.from(res.data, 'base64url'));

    applyUpdateV2(document, update);

    logContext('Loaded state/update applied', context);
  },

  onStoreDocument: async ({ context, document }) => {
    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to store document without context' });
      throw new Error('Invalid context');
    }

    const { behandlingId, dokumentId, req } = context;

    await setDocument(req, document, behandlingId, dokumentId);

    logContext('Saved document to database', context);
  },

  extensions: isDeployed ? [getRedisExtension()].filter(isNotNull) : [],
});
