import type { IncomingHttpHeaders } from 'node:http';
import { slateNodesToInsertDelta } from '@slate-yjs/core';
import type { Node } from 'slate';
import { Doc, encodeStateAsUpdateV2, XmlText } from 'yjs';
import { ApiClientEnum } from '@/config/config';
import { isObject } from '@/functions/functions';
import { withSpan } from '@/helpers/tracing';
import { getLogger } from '@/logger';
import { KABAL_API_URL } from '@/plugins/crdt/api/url';
import { getCloseEvent } from '@/plugins/crdt/close-event';
import type { ConnectionContext } from '@/plugins/crdt/context';
import { getOboToken } from '@/plugins/obo-token';

const log = getLogger('collaboration');

export const getDocument = async (
  context: ConnectionContext,
  headers: IncomingHttpHeaders,
): Promise<DocumentResponse> => {
  const { behandlingId, dokumentId, navIdent, tab_id, client_version } = context;

  return withSpan(
    'collaboration.get_document',
    {
      behandling_id: behandlingId,
      dokument_id: dokumentId,
      nav_ident: navIdent,
      tab_id: tab_id ?? '',
      client_version,
    },
    async (span) => {
      const accessToken = headers.authorization;

      if (accessToken === undefined) {
        log.error({
          msg: 'Missing authorization header. Closing connection.',
          tab_id,
          client_version,
          data: { behandlingId, dokumentId },
        });

        throw getCloseEvent('MISSING_AUTHORIZATION', 4401);
      }

      const authorization = `Bearer ${await getOboToken(ApiClientEnum.KABAL_API, { ...context, accessToken })}`;

      const res = await fetch(`${KABAL_API_URL}/behandlinger/${behandlingId}/dokumenter/${dokumentId}`, {
        method: 'GET',
        headers: { accept: 'application/json', authorization },
      });

      span.setAttribute('http.status_code', res.status);

      if (!res.ok) {
        if (res.status === 404) {
          log.error({
            msg: 'Document not found. Closing connection.',
            tab_id,
            client_version,
            data: { behandlingId, dokumentId, statusCode: res.status },
          });

          context.socket.close(4404, 'DOCUMENT_NOT_FOUND');

          throw getCloseEvent('DOCUMENT_NOT_FOUND', 4404);
        }

        const msg = `Failed to fetch document. API responded with status code ${res.status}.`;

        log.error({
          msg,
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
          headers: { 'Content-Type': 'application/json', authorization },
          body: JSON.stringify({ content, data: base64data }),
        });

        // Return the document and binary data.
        return { content, data: base64data };
      }

      return { content, data };
    },
  );
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
