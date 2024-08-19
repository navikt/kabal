import { Server } from '@hocuspocus/server';
import { getLogger } from '@app/logger';
import { isConnectionContext } from '@app/plugins/crdt/context';
import { isDeployed } from '@app/config/env';
import { getRedisExtension } from '@app/plugins/crdt/redis';
import { isNotNull } from '@app/functions/guards';
import { getDocument } from '@app/plugins/crdt/api/get-document';
import { XmlText, applyUpdateV2, encodeStateAsUpdateV2 } from 'yjs';
import { KABAL_API_URL } from '@app/plugins/crdt/api/url';
import { getHeaders } from '@app/plugins/crdt/api/headers';
import { yTextToSlateElement } from '@slate-yjs/core';

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

    const update = Buffer.from(encodeStateAsUpdateV2(document));
    const data = update.toString('base64url');

    const sharedRoot = document.get('content', XmlText);
    const nodes = yTextToSlateElement(sharedRoot);

    const res = await fetch(`${KABAL_API_URL}/behandlinger/${behandlingId}/smartdokumenter/${dokumentId}`, {
      method: 'PATCH',
      headers: { ...getHeaders(req), 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: nodes.children, data }),
    });

    if (!res.ok) {
      const msg = `Failed to save document. API responded with status code ${res.status}.`;
      const text = await res.text();
      log.error({ msg, data: { behandlingId, dokumentId, statusCode: res.status, response: text } });

      throw new Error(`${msg} - ${text}`);
    }

    log.info({
      msg: 'Saved document to database',
      data: { behandlingId, dokumentId, content: JSON.stringify(nodes, null, 2) },
    });
  },

  extensions: isDeployed ? [getRedisExtension()].filter(isNotNull) : [],
});
