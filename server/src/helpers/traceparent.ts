/**
 * Extracts trace_id and span_id from a W3C traceparent header string.
 *
 * Used to extract trace context from Kafka message headers for log correlation,
 * since Kafka messages are not covered by OTel HTTP instrumentation.
 */
export const parseTraceparent = (
  traceparent: string,
): { trace_id: string | undefined; span_id: string | undefined } => {
  const [, trace_id, span_id] = traceparent.split('-');

  return { trace_id, span_id };
};
