import { ENVIRONMENT } from '@app/environment';
import { generateTraceParent } from '@app/functions/generate-request-id';

export const TAB_UUID = crypto.randomUUID();

enum HeaderKeys {
  TRACEPARENT = 'traceparent',
  VERSION = 'x-client-version',
  TAB_ID = 'x-tab-id',
}

enum QueryKeys {
  TRACEPARENT = 'traceparent',
  VERSION = 'version',
  TAB_ID = 'tabId',
}

export const getHeaders = () => ({
  [HeaderKeys.TRACEPARENT]: generateTraceParent(),
  [HeaderKeys.VERSION]: ENVIRONMENT.version,
  [HeaderKeys.TAB_ID]: TAB_UUID,
});

export const setHeaders = (headers: Headers): Headers => {
  headers.set(HeaderKeys.TRACEPARENT, generateTraceParent());
  headers.set(HeaderKeys.VERSION, ENVIRONMENT.version);
  headers.set(HeaderKeys.TAB_ID, TAB_UUID);

  return headers;
};

export const getQueryParams = () => {
  const { version } = ENVIRONMENT;
  const traceParent = generateTraceParent();

  return new URLSearchParams({
    [QueryKeys.VERSION]: version,
    [QueryKeys.TAB_ID]: TAB_UUID,
    [QueryKeys.TRACEPARENT]: traceParent,
  });
};
