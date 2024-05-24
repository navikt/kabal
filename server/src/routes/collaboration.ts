import { Server } from '@hocuspocus/server';
import { slateNodesToInsertDelta, yTextToSlateElement } from '@slate-yjs/core';
import { Node } from 'slate';
import * as Y from 'yjs';
import { getLogger } from '@app/logger';

const log = getLogger('collaboration');

interface Context {
  behandlingId: string;
  dokumentId: string;
  oboAccessToken: string;
  accessToken: string;
}

export const collaborationServer = Server.configure({
  onConnect: async (data) => {
    if (isContext(data.context)) {
      const { behandlingId, dokumentId } = data.context;
      log.info({ msg: 'Connected!', data: { behandlingId, dokumentId } });
    } else {
      log.info({ msg: 'Connected!', data: 'No context' });
    }
  },
  onStoreDocument: async (data) => {
    if (isContext(data.context)) {
      const { behandlingId, dokumentId, oboAccessToken, accessToken } = data.context;

      log.info({ msg: 'Store document', data: { behandlingId, dokumentId } });

      const sharedRoot = data.document.get('content', Y.XmlText);
      const nodes = yTextToSlateElement(sharedRoot);

      // TODO: Traceparent
      const res = await fetch(`http://kabal-api/behandlinger/${behandlingId}/smartdokumenter/${dokumentId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${oboAccessToken}`,
          'azure-ad-token': accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: nodes.children }),
      });

      if (!res.ok) {
        log.error({ msg: 'Failed to save document', data: { behandlingId, dokumentId, statusCode: res.status } });

        return;
      }

      log.info({ msg: 'Stored document', data: { behandlingId, dokumentId, content: JSON.stringify(nodes, null, 2) } });
    } else {
      log.info({ msg: 'Store document', data: 'No context' });
    }
  },
  onLoadDocument: async (data) => {
    log.info({ msg: 'Load document', data: JSON.stringify(data) });

    if (isContext(data.context)) {
      const { behandlingId, dokumentId, oboAccessToken, accessToken } = data.context;

      log.info({ msg: 'Context', data: JSON.stringify({ behandlingId, dokumentId }) });

      // TODO: Traceparent
      const res = await fetch(`http://kabal-api/behandlinger/${behandlingId}/dokumenter/${dokumentId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${oboAccessToken}`,
          'azure-ad-token': accessToken,
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        log.error({ msg: 'Failed to fetch document', data: { behandlingId, dokumentId, statusCode: res.status } });

        return;
      }

      const json = await res.json();

      if (!isDocumentResponse(json)) {
        log.error({ msg: 'Invalid document response', data: JSON.stringify(json) });

        return;
      }

      const insertDelta = slateNodesToInsertDelta(json.content);

      const sharedRoot = data.document.get('content', Y.XmlText);
      sharedRoot.applyDelta(insertDelta);

      return data.document;
    }
  },
  extensions: [],
});

const isContext = (data: unknown): data is Context => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  return 'behandlingId' in data && 'dokumentId' in data && 'oboAccessToken' in data && 'accessToken' in data;
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
