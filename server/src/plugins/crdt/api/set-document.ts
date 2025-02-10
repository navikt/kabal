import { getCacheKey, oboCache } from '@app/auth/cache/cache';
import { ApiClientEnum } from '@app/config/config';
import { generateTraceparent } from '@app/helpers/traceparent';
import { getLogger } from '@app/logger';
import { KABAL_API_URL } from '@app/plugins/crdt/api/url';
import type { ConnectionContext } from '@app/plugins/crdt/context';
import type { Document } from '@hocuspocus/server';
import { yTextToSlateElement } from '@slate-yjs/core';
import { XmlText, encodeStateAsUpdateV2 } from 'yjs';

const log = getLogger('collaboration');

export const getDocumentJson = (document: Document) => {
  const sharedRoot = document.get('content', XmlText);

  return yTextToSlateElement(sharedRoot).children;
};

export const setDocument = async (context: ConnectionContext, document: Document) => {
  const { behandlingId, dokumentId, navIdent, trace_id, span_id, tab_id, client_version } = context;
  const update = Buffer.from(encodeStateAsUpdateV2(document));
  const data = update.toString('base64url');

  const content = getDocumentJson(document);

  const res = await fetch(`${KABAL_API_URL}/behandlinger/${behandlingId}/smartdokumenter/${dokumentId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${await oboCache.get(getCacheKey(navIdent, ApiClientEnum.KABAL_API))}`,
      traceparent: generateTraceparent(trace_id),
    },
    body: JSON.stringify({ content, data }),
  });

  if (!res.ok) {
    const msg = `Failed to save document. API responded with status code ${res.status}.`;
    const text = await res.text();

    log.error({
      msg,
      trace_id,
      span_id,
      tab_id,
      client_version,
      data: { behandlingId, dokumentId, statusCode: res.status, response: text },
    });

    throw new Error(`${msg} - ${text}`);
  }

  return res;
};
