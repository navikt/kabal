import { getLogger } from '@app/logger';
import { getHeaders } from '@app/plugins/crdt/api/headers';
import { KABAL_API_URL } from '@app/plugins/crdt/api/url';
import { isObject } from '@app/plugins/crdt/functions';
import { FastifyRequest } from 'fastify';
import { Node } from 'slate';

const log = getLogger('collaboration');

export const getDocument = async (req: FastifyRequest, behandlingId: string, dokumentId: string) => {
  const res = await fetch(`${KABAL_API_URL}/behandlinger/${behandlingId}/dokumenter/${dokumentId}`, {
    method: 'GET',
    headers: getHeaders(req),
  });

  if (!res.ok) {
    const msg = `Failed to fetch document. API responded with status code ${res.status}.`;
    log.error({
      msg,
      trace_id: req.trace_id,
      span_id: req.span_id,
      tab_id: req.tab_id,
      client_version: req.client_version,
      data: { behandlingId, dokumentId, statusCode: res.status },
    });
    throw new Error(msg);
  }

  const json = await res.json();

  if (!isDocumentResponse(json)) {
    const msg = 'Invalid document response';
    log.error({
      msg,
      trace_id: req.trace_id,
      span_id: req.span_id,
      tab_id: req.tab_id,
      client_version: req.client_version,
      data: { response: JSON.stringify(json) },
    });

    throw new Error(msg);
  }

  return json;
};

interface DocumentResponse {
  content: Node[];
  data: string;
}

export const isDocumentResponse = (data: unknown): data is DocumentResponse =>
  isObject(data) &&
  'isSmartDokument' in data &&
  data.isSmartDokument === true &&
  'content' in data &&
  Array.isArray(data.content) &&
  'data' in data &&
  typeof data.data === 'string';
