import { getLogger } from '@app/logger';
import { Doc, XmlText, encodeStateAsUpdateV2 } from 'yjs';
import { slateNodesToInsertDelta } from '@slate-yjs/core';
import { KABAL_API_URL } from '@app/plugins/crdt/api/url';
import { isObject } from '@app/plugins/crdt/functions';
import { Node } from 'slate';
import { generateTraceparent } from '@app/helpers/traceparent';
import { ConnectionContext } from '@app/plugins/crdt/context';
import { getCacheKey, oboCache } from '@app/auth/cache/cache';
import { ApiClientEnum } from '@app/config/config';

const log = getLogger('collaboration');

export const getDocument = async (context: ConnectionContext): Promise<DocumentResponse> => {
  const { behandlingId, dokumentId, navIdent, trace_id, span_id, tab_id, client_version } = context;
  const res = await fetch(`${KABAL_API_URL}/behandlinger/${behandlingId}/dokumenter/${dokumentId}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${await oboCache.get(getCacheKey(navIdent, ApiClientEnum.KABAL_API))}`,
      traceparent: generateTraceparent(trace_id),
    },
  });

  if (!res.ok) {
    const msg = `Failed to fetch document. API responded with status code ${res.status}.`;
    log.error({
      msg,
      trace_id,
      span_id,
      tab_id,
      client_version,
      data: { behandlingId, dokumentId, statusCode: res.status },
    });
    throw new Error(msg);
  }

  const json = await res.json();

  if (!isDocumentResponse(json)) {
    const msg = 'Invalid document response';
    log.error({
      msg,
      trace_id,
      span_id,
      tab_id,
      client_version,
      data: { response: JSON.stringify(json) },
    });

    throw new Error(msg);
  }

  const { content, data } = json;

  // If the document has no binary data, create and save it.
  if (data === null || data.length === 0) {
    const document = new Doc();
    const sharedRoot = document.get('content', XmlText);
    const insertDelta = slateNodesToInsertDelta(content);
    sharedRoot.applyDelta(insertDelta);
    const state = encodeStateAsUpdateV2(document);
    const base64data = Buffer.from(state).toString('base64');

    // Save the binary data to the database.
    await fetch(`${KABAL_API_URL}/behandlinger/${behandlingId}/smartdokumenter/${dokumentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${await oboCache.get(getCacheKey(navIdent, ApiClientEnum.KABAL_API))}`,
        traceparent: generateTraceparent(trace_id),
      },
      body: JSON.stringify({ content, data: base64data }),
    });

    // Return the document and binary data.
    return { content, data: base64data };
  }

  return { content, data };
};

interface DocumentResponse {
  content: Node[];
  data: string;
}

interface ApiDocumentResponse {
  content: Node[];
  data: string | null;
}

export const isDocumentResponse = (data: unknown): data is ApiDocumentResponse =>
  isObject(data) &&
  'isSmartDokument' in data &&
  data.isSmartDokument === true &&
  'content' in data &&
  Array.isArray(data.content) &&
  'data' in data;
