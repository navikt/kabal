import { Server } from '@hocuspocus/server';
import { slateNodesToInsertDelta, yTextToSlateElement } from '@slate-yjs/core';
import { Node } from 'slate';
import * as Y from 'yjs';
import { getLogger } from '@app/logger';
import { FastifyRequest } from 'fastify';
import { AZURE_AD_TOKEN_HEADER, CLIENT_VERSION_HEADER, PROXY_VERSION_HEADER, TAB_ID_HEADER } from '@app/headers';
import { PROXY_VERSION } from '@app/config/config';
import { isNotNull } from '@app/functions/guards';
import { getRedisExtension } from '@app/plugins/crdt/redis';

const log = getLogger('collaboration');

export interface ConnectionContext {
  behandlingId: string;
  dokumentId: string;
  req: FastifyRequest;
}

export const collaborationServer = Server.configure({
  onConnect: async ({ context }) => {
    if (isConnectionContext(context)) {
      const { behandlingId, dokumentId } = context;
      log.info({ msg: 'Collaboration connection established!', data: { behandlingId, dokumentId } });
    } else {
      log.error({ msg: 'Tried to establish collaboration connection without context' });
      throw new Error('Invalid context');
    }
  },

  onStoreDocument: async ({ context, document }) => {
    if (!isConnectionContext(context)) {
      log.info({ msg: 'Tried to store document without context' });

      throw new Error('Invalid context');
    }

    const { behandlingId, dokumentId, req } = context;
    const { accessToken, client_version, tab_id } = req;

    log.info({ msg: 'Store document', data: { behandlingId, dokumentId } });

    const sharedRoot = document.get('content', Y.XmlText);
    const nodes = yTextToSlateElement(sharedRoot);

    const res = await fetch(`http://kabal-api/behandlinger/${behandlingId}/smartdokumenter/${dokumentId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${req.getOboAccessToken('kabal-api')}`,
        'Content-Type': 'application/json',
        traceparent: req.traceparent,
        [AZURE_AD_TOKEN_HEADER]: accessToken,
        [PROXY_VERSION_HEADER]: PROXY_VERSION,
        [CLIENT_VERSION_HEADER]: client_version,
        [TAB_ID_HEADER]: tab_id,
      },
      body: JSON.stringify({ content: nodes.children }),
    });

    if (!res.ok) {
      log.error({ msg: 'Failed to save document', data: { behandlingId, dokumentId, statusCode: res.status } });

      throw new Error('Failed to save document');
    }

    log.info({ msg: 'Stored document', data: { behandlingId, dokumentId, content: JSON.stringify(nodes, null, 2) } });
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

    log.info({ msg: 'Load document' });

    const { behandlingId, dokumentId, req } = context;
    const { accessToken, client_version, tab_id } = req;

    const res = await fetch(`http://kabal-api/behandlinger/${behandlingId}/dokumenter/${dokumentId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${req.getOboAccessToken('kabal-api')}`,
        Accept: 'application/json',
        traceparent: req.traceparent,
        [AZURE_AD_TOKEN_HEADER]: accessToken,
        [PROXY_VERSION_HEADER]: PROXY_VERSION,
        [CLIENT_VERSION_HEADER]: client_version,
        [TAB_ID_HEADER]: tab_id,
      },
    });

    if (!res.ok) {
      log.error({ msg: 'Failed to fetch document', data: { behandlingId, dokumentId, statusCode: res.status } });

      throw new Error('Failed to fetch document');
    }

    const json = await res.json();

    if (!isDocumentResponse(json)) {
      log.error({ msg: 'Invalid document response', data: JSON.stringify(json) });

      throw new Error('Invalid document response');
    }

    const insertDelta = slateNodesToInsertDelta(json.content);

    const sharedRoot = document.get('content', Y.XmlText);
    sharedRoot.applyDelta(insertDelta);

    return document;
  },
  extensions: [getRedisExtension()].filter(isNotNull),
});

const isConnectionContext = (data: unknown): data is ConnectionContext => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  return 'behandlingId' in data && 'dokumentId' in data && 'req' in data;
};

interface DocumentResponse {
  content: Node[];
}

const isDocumentResponse = (data: unknown): data is DocumentResponse => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  return 'isSmartDokument' in data && data.isSmartDokument === true && 'content' in data && Array.isArray(data.content);
};
