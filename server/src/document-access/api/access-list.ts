import { getToken } from '@app/document-access/api/token';
import { ACCESS_LIST_CHECKER, type AccessList, type Metadata } from '@app/document-access/types';
import { generateTraceparent } from '@app/helpers/traceparent';
import { getLogger } from '@app/logger';
import { KABAL_API_URL } from '@app/plugins/crdt/api/url';

const log = getLogger('document-write-access-api');

export const getAccessListFromApi = async (documentId: string, metadata: Metadata): Promise<AccessList> => {
  const { access_token } = await getToken();

  const { trace_id, span_id, tab_id, behandling_id, client_version } = metadata;

  const headers = new Headers({
    accept: 'application/json',
    traceparent: generateTraceparent(trace_id, span_id),
    'x-behandling-id': behandling_id,
    Authorization: `Bearer ${access_token}`,
  });

  if (tab_id !== undefined) {
    headers.set('x-tab-id', tab_id);
  }

  if (client_version !== undefined) {
    headers.set('x-client-version', client_version);
  }

  const start = performance.now();

  const response = await fetch(`${KABAL_API_URL}/smart-document-write-access/${documentId}`, {
    method: 'GET',
    headers,
  });

  const duration = performance.now() - start;

  if (!response.ok) {
    log.error({
      msg: 'Failed to GET kabal-api/smart-document-write-access/:documentId',
      data: { status: response.status, document_id: documentId, behandling_id, duration },
      trace_id,
      span_id,
      tab_id,
      client_version,
    });

    throw new Error('Failed to GET kabal-api/smart-document-write-access/:documentId');
  }

  const navIdents = await response.json();

  if (!ACCESS_LIST_CHECKER.Check(navIdents)) {
    log.error({
      msg: 'Invalid response from GET kabal-api/smart-document-write-access/:documentId',
      data: {
        nav_idents: JSON.stringify(navIdents),
        status: response.status,
        document_id: documentId,
        behandling_id,
        duration,
      },
      trace_id,
      span_id,
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
    trace_id,
    span_id,
    tab_id,
    client_version,
  });

  return navIdents;
};
