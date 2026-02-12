import type { IncomingHttpHeaders } from 'node:http';
import { ApiClientEnum } from '@app/config/config';
import { isObject } from '@app/functions/functions';
import { generateTraceparent } from '@app/helpers/traceparent';
import { getLogger } from '@app/logger';
import { KABAL_API_URL } from '@app/plugins/crdt/api/url';
import { getCloseEvent } from '@app/plugins/crdt/close-event';
import type { ConnectionContext } from '@app/plugins/crdt/context';
import { getOboToken } from '@app/plugins/obo-token';
import { slateNodesToInsertDelta } from '@slate-yjs/core';
import type { Node } from 'slate';
import { Doc, encodeStateAsUpdateV2, XmlText } from 'yjs';

const log = getLogger('collaboration');

export const getDocument = async (
  context: ConnectionContext,
  headers: IncomingHttpHeaders,
): Promise<DocumentResponse> => {
  const { behandlingId, dokumentId, trace_id, span_id, tab_id, client_version } = context;

  const accessToken = headers.authorization;

  if (accessToken === undefined) {
    log.error({
      msg: 'Missing authorization header. Closing connection.',
      trace_id,
      span_id,
      tab_id,
      client_version,
      data: { behandlingId, dokumentId },
    });

    throw getCloseEvent('MISSING_AUTHORIZATION', 4401);
  }

  const authorization = `Bearer ${await getOboToken(ApiClientEnum.KABAL_API, { ...context, accessToken })}`;

  const res = await fetch(`${KABAL_API_URL}/behandlinger/${behandlingId}/dokumenter/${dokumentId}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization,
      traceparent: generateTraceparent(trace_id),
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      log.error({
        msg: 'Document not found. Closing connection.',
        trace_id,
        span_id,
        tab_id,
        client_version,
        data: { behandlingId, dokumentId, statusCode: res.status },
      });

      throw getCloseEvent('DOCUMENT_NOT_FOUND', 4404);
    }

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
        authorization,
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
