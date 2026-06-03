import { getToken } from '@/document-access/api/token';
import { DOCUMENT_ACCESS_LIST_CHECKER, type DocumentAccessList, type Metadata } from '@/document-access/types';
import { withSpan } from '@/helpers/tracing';
import { getLogger } from '@/logger';
import { KABAL_API_URL } from '@/plugins/crdt/api/url';

const log = getLogger('document-write-access-api');

/** Thrown when the API reports that a document no longer exists (HTTP 404). */
export class DocumentAccessNotFoundError extends Error {
  constructor(documentId: string) {
    super(`Document access list not found for document ${documentId}`);
    this.name = 'DocumentAccessNotFoundError';
  }
}

export const getDocumentAccessListFromApi = async (
  documentId: string,
  metadata: Metadata,
): Promise<DocumentAccessList> =>
  withSpan(
    'document_access.get_access_list',
    {
      document_id: documentId,
      behandling_id: metadata.behandling_id ?? '',
      tab_id: metadata.tab_id ?? '',
      client_version: metadata.client_version ?? '',
    },
    async (span) => {
      const { access_token } = await getToken();

      const { tab_id, behandling_id, client_version } = metadata;

      const headers = new Headers({
        accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      });

      if (tab_id !== undefined) {
        headers.set('x-tab-id', tab_id);
      }

      if (client_version !== undefined) {
        headers.set('x-client-version', client_version);
      }

      if (behandling_id !== undefined) {
        headers.set('x-behandling-id', behandling_id);
      }

      const start = performance.now();

      const response = await fetch(`${KABAL_API_URL}/smart-document-write-access/${documentId}`, {
        method: 'GET',
        headers,
      });

      const duration = performance.now() - start;

      span.setAttribute('http.status_code', response.status);

      // A 404 is an authoritative signal that the document has been deleted,
      // distinct from a transient failure. Surface it as a typed error so
      // callers can act on the deletion instead of treating it as an outage.
      if (response.status === 404) {
        log.info({
          msg: 'Document deleted (404) from GET kabal-api/smart-document-write-access/:documentId',
          data: { status: response.status, document_id: documentId, behandling_id, duration },
          tab_id,
          client_version,
        });

        throw new DocumentAccessNotFoundError(documentId);
      }

      if (!response.ok) {
        log.error({
          msg: 'Failed to GET kabal-api/smart-document-write-access/:documentId',
          data: { status: response.status, document_id: documentId, behandling_id, duration },
          tab_id,
          client_version,
        });

        throw new Error('Failed to GET kabal-api/smart-document-write-access/:documentId');
      }

      const navIdents = await response.json();

      if (!DOCUMENT_ACCESS_LIST_CHECKER.Check(navIdents)) {
        log.error({
          msg: 'Invalid response from GET kabal-api/smart-document-write-access/:documentId',
          data: {
            nav_idents: JSON.stringify(navIdents),
            status: response.status,
            document_id: documentId,
            behandling_id,
            duration,
          },
          tab_id,
          client_version,
        });

        throw new Error('Invalid response from GET kabal-api/smart-document-write-access/:documentId');
      }

      log.info({
        msg: 'GET kabal-api/smart-document-write-access/:documentId',
        data: {
          nav_idents: JSON.stringify(navIdents),
          status: response.status,
          document_id: documentId,
          behandling_id,
          duration,
        },
        tab_id,
        client_version,
      });

      return navIdents;
    },
  );
