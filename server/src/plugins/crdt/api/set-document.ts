import { getLogger } from '@app/logger';
import { getHeaders } from '@app/plugins/crdt/api/headers';
import { KABAL_API_URL } from '@app/plugins/crdt/api/url';
import { Document } from '@hocuspocus/server';
import { yTextToSlateElement } from '@slate-yjs/core';
import { FastifyRequest } from 'fastify';
import { XmlText, encodeStateAsUpdateV2 } from 'yjs';

const log = getLogger('collaboration');

export const setDocument = async (
  req: FastifyRequest,
  document: Document,
  behandlingId: string,
  dokumentId: string,
) => {
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
    log.error({
      msg,
      trace_id: req.trace_id,
      span_id: req.span_id,
      tab_id: req.tab_id,
      client_version: req.client_version,
      data: { behandlingId, dokumentId, statusCode: res.status, response: text },
    });

    throw new Error(`${msg} - ${text}`);
  }

  return res;
};
