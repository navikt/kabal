import { context, propagation } from '@opentelemetry/api';
import { ENVIRONMENT } from '@/environment';

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

const getTraceparent = (): string => {
  const carrier: Record<string, string> = {};
  propagation.inject(context.active(), carrier);

  return carrier[HeaderKeys.TRACEPARENT] ?? generateFallbackTraceparent();
};

/** Fallback traceparent generator when no active OTel context exists. */
const generateFallbackTraceparent = (): string => {
  const traceId = crypto.randomUUID().replaceAll('-', '');
  const parentId = crypto.randomUUID().replaceAll('-', '').substring(0, 16);

  return `00-${traceId}-${parentId}-00`;
};

export const getHeaders = () => ({
  [HeaderKeys.TRACEPARENT]: getTraceparent(),
  [HeaderKeys.VERSION]: ENVIRONMENT.version,
  [HeaderKeys.TAB_ID]: TAB_UUID,
});

export const setHeaders = (headers: Headers): Headers => {
  headers.set(HeaderKeys.TRACEPARENT, getTraceparent());
  headers.set(HeaderKeys.VERSION, ENVIRONMENT.version);
  headers.set(HeaderKeys.TAB_ID, TAB_UUID);

  return headers;
};

export const getQueryParams = () => {
  const { version } = ENVIRONMENT;
  const traceParent = getTraceparent();

  return new URLSearchParams({
    [QueryKeys.VERSION]: version,
    [QueryKeys.TAB_ID]: TAB_UUID,
    [QueryKeys.TRACEPARENT]: traceParent,
  });
};
