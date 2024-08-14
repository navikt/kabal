import { Server } from '@hocuspocus/server';
import { slateNodesToInsertDelta, yTextToSlateElement } from '@slate-yjs/core';
import { Node } from 'slate';
import * as Y from 'yjs';
import { getLogger } from '@app/logger';
import { FastifyRequest } from 'fastify';
import { isNotNull } from '@app/functions/guards';
import { getRedisExtension } from '@app/plugins/crdt/redis';
import { isDeployed } from '@app/config/env';
import { getHeaders } from '@app/plugins/crdt/headers';

const log = getLogger('collaboration');

export interface ConnectionContext {
  behandlingId: string;
  dokumentId: string;
  req: FastifyRequest;
}

const KABAL_API_URL = isDeployed ? 'http://kabal-api' : 'https://kabal.intern.dev.nav.no/api/kabal-api';

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

    log.info({ msg: 'Store document', data: { behandlingId, dokumentId } });

    const sharedRoot = document.get('content', Y.XmlText);
    const nodes = yTextToSlateElement(sharedRoot);

    try {
      const res = await fetch(`${KABAL_API_URL}/behandlinger/${behandlingId}/smartdokumenter/${dokumentId}`, {
        method: 'PATCH',
        headers: { ...getHeaders(req), 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: nodes.children }),
      });

      if (!res.ok) {
        const msg = `Failed to save document. API responded with status code ${res.status}.`;
        const text = await res.text();
        log.error({ msg, data: { behandlingId, dokumentId, statusCode: res.status, response: text } });

        throw new Error(`${msg} - ${text}`);
      }

      log.info({ msg: 'Stored document', data: { behandlingId, dokumentId, content: JSON.stringify(nodes, null, 2) } });
    } catch (error) {
      console.error(error, getHeaders(req));

      throw error;
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

    log.info({ msg: 'Load document' });

    const { behandlingId, dokumentId, req } = context;

    try {
      const res = await fetch(`${KABAL_API_URL}/behandlinger/${behandlingId}/dokumenter/${dokumentId}`, {
        method: 'GET',
        headers: getHeaders(req),
      });

      if (!res.ok) {
        const msg = `Failed to fetch document. API responded with status code ${res.status}.`;
        log.error({ msg, data: { behandlingId, dokumentId, statusCode: res.status } });
        throw new Error(msg);
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
    } catch (error) {
      console.error(error, getHeaders(req));

      throw error;
    }
  },
  extensions: isDeployed ? [getRedisExtension()].filter(isNotNull) : [],
});

const isConnectionContext = (data: unknown): data is ConnectionContext =>
  isObject(data) && 'behandlingId' in data && 'dokumentId' in data && 'req' in data;

interface DocumentResponse {
  content: Node[];
}

const isDocumentResponse = (data: unknown): data is DocumentResponse =>
  isObject(data) &&
  'isSmartDokument' in data &&
  data.isSmartDokument === true &&
  'content' in data &&
  Array.isArray(data.content);

const isObject = (data: unknown): data is object => typeof data === 'object' && data !== null;
