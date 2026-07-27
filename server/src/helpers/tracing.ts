import { type Span, SpanStatusCode } from '@opentelemetry/api';
import { tracer } from '@/tracing/tracer';

/**
 * Wraps an async operation in a short-lived OTel span.
 * Records errors and sets span status automatically.
 */
export const withSpan = async <T>(
  name: string,
  attributes: Record<string, string | number | boolean | undefined>,
  fn: (span: Span) => Promise<T>,
): Promise<T> => {
  return tracer.startActiveSpan(name, { attributes }, async (span) => {
    try {
      const result = await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });

      return result;
    } catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR });

      if (error instanceof Error) {
        span.recordException(error);
      }

      throw error;
    } finally {
      span.end();
    }
  });
};
