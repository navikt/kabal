import { getToken } from '@app/document-access/api/token';
import { ACCESS_LISTS_CHECKER, type AccessLists } from '@app/document-access/types';
import { generateSpanId, generateTraceId, generateTraceparent } from '@app/helpers/traceparent';
import { getLogger } from '@app/logger';
import { KABAL_API_URL } from '@app/plugins/crdt/api/url';

const log = getLogger('document-write-access-api');

export const getAccessListsFromApi = async (trace_id = generateTraceId()): Promise<AccessLists | null> => {
  const span_id = generateSpanId();

  const { access_token } = await getToken(trace_id);

  const start = performance.now();

  log.debug({ msg: 'Fetching access lists from API...', trace_id, span_id });

  const response = await fetch(`${KABAL_API_URL}/smart-document-write-access`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      traceparent: generateTraceparent(trace_id, span_id),
      Authorization: `Bearer ${access_token}`,
    },
  });

  const duration = performance.now() - start;

  if (!response.ok) {
    log.error({
      msg: 'Failed to GET kabal-api/smart-document-write-access',
      data: { status: response.status, trace_id, span_id, duration },
    });

    return null;
  }

  const accessLists = await response.json();

  if (!ACCESS_LISTS_CHECKER.Check(accessLists)) {
    log.error({
      msg: 'Invalid response from GET kabal-api/smart-document-write-access',
      data: { accessLists: JSON.stringify(accessLists), duration },
      trace_id,
      span_id,
    });

    return null;
  }

  log.debug({
    msg: `Successfully fetched access lists in ${duration}ms`,
    data: {
      accessLists: Object.fromEntries(
        accessLists.smartDocumentWriteAccessList.map(({ documentId, navIdents }) => [documentId, navIdents]),
      ),
      duration,
    },
    trace_id,
    span_id,
  });

  return accessLists;
};
