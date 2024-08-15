import { yTextToSlateElement } from '@slate-yjs/core';
import * as Y from 'yjs';
import { getLogger } from '@app/logger';
import { getHeaders } from '@app/plugins/crdt/api/headers';
import { storePayload } from '@hocuspocus/server';
import { isConnectionContext } from '@app/plugins/crdt/context';
import { KABAL_API_URL } from '@app/plugins/crdt/api/url';

const log = getLogger('collaboration');

export const saveDocument = async ({ documentName, context, state, document }: storePayload) => {
  log.info({ msg: `Saving ${documentName} to database...` });

  if (!isConnectionContext(context)) {
    log.info({ msg: 'Tried to store document without context' });

    throw new Error('Invalid context');
  }

  const { behandlingId, dokumentId, req } = context;

  log.info({ msg: 'Save document', data: { behandlingId, dokumentId } });

  const sharedRoot = document.get('content', Y.XmlText);
  const nodes = yTextToSlateElement(sharedRoot);

  const data = state.toString('base64');

  try {
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
  } catch (error) {
    log.error({ error });
    throw error;
  }
};
