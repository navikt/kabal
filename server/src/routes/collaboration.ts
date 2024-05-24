import { Server } from '@hocuspocus/server';
import { slateNodesToInsertDelta } from '@slate-yjs/core';
import { Node } from 'slate';
import * as Y from 'yjs';
import { getLogger } from '@app/logger';

const log = getLogger('websocket');

interface Context {
  behandlingId: string;
  dokumentId: string;
  oboAccessToken: string;
  accessToken: string;
}

export const wsServer = Server.configure({
  onConnect: async () => {
    log.info({ msg: 'Connected!' });
  },
  onStoreDocument: async (doc) => {
    log.info({ msg: 'Store document', data: JSON.stringify(doc) });
  },
  onLoadDocument: async (data) => {
    log.info({ msg: 'Load document', data: JSON.stringify(data) });

    if (isContext(data.context)) {
      log.info({ msg: 'Context', data: JSON.stringify(data.context) });

      const { behandlingId, dokumentId, oboAccessToken, accessToken } = data.context;

      const res = await fetch(`http://kabal-api/behandlinger/${behandlingId}/dokumenter/${dokumentId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${oboAccessToken}`,
          'azure-ad-token': accessToken,
        },
      });

      if (!res.ok) {
        log.error({ msg: 'Failed to fetch document', data: { behandlingId, dokumentId } });

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

  return 'content' in data;
};
