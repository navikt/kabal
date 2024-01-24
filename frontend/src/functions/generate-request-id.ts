const getUUID = () => crypto.randomUUID().replaceAll('-', '');

const TRACE_VERSION = '00';
const TRACE_FLAGS = '00';

/** Generates a traceparent ID according to https://www.w3.org/TR/trace-context/#version-format */
export const generateTraceParent = (): string => {
  const traceId = getUUID();
  const parentId = getUUID().substring(0, 16);

  return `${TRACE_VERSION}-${traceId}-${parentId}-${TRACE_FLAGS}`;
};
