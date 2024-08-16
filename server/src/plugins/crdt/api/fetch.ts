import { getHeaders } from '@app/plugins/crdt/api/headers';
import { Node } from 'slate';
import { KABAL_API_URL } from '@app/plugins/crdt/api/url';
import { isConnectionContext } from '@app/plugins/crdt/context';
import { fetchPayload } from '@hocuspocus/server';
import { getLogger } from '@app/logger';
import { isObject } from '@app/plugins/crdt/functions';

const log = getLogger('collaboration');

export const fetchDocument = async ({ documentName, context }: fetchPayload) => {
  log.info({ msg: `Fetch ${documentName}` });

  if (!isConnectionContext(context)) {
    log.error({ msg: 'Tried to load document without context' });

    throw new Error('Invalid context');
  }

  log.info({ msg: 'Fetch document' });

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
      log.error({ msg: 'Invalid document response', data: { response: JSON.stringify(json) } });

      throw new Error('Invalid document response');
    }

    return Buffer.from(json.data, 'base64');
  } catch (error) {
    log.error({ error });
    throw error;
  }
};

interface DocumentResponse {
  content: Node[];
  data: string;
}

const isDocumentResponse = (data: unknown): data is DocumentResponse =>
  isObject(data) &&
  'isSmartDokument' in data &&
  data.isSmartDokument === true &&
  'content' in data &&
  Array.isArray(data.content) &&
  'data' in data &&
  typeof data.data === 'string';
