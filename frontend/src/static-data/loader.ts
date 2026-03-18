import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { SpanStatusCode } from '@opentelemetry/api';
import { ENVIRONMENT } from '@/environment';
import { getHeaders } from '@/headers';
import { tracer } from '@/tracing/tracer';

export const loadStaticData = async <T>(url: string, name: string, attempt = 0): Promise<T> => {
  return tracer.startActiveSpan(`static_data.load.${name}`, async (span) => {
    span.setAttributes({
      name,
      attempt,
    });

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (res.status === 401) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: 'Unauthorized, redirecting to login' });

        if (!ENVIRONMENT.isLocal) {
          // End span before flush+redirect — finally will no-op since OTel ignores double end().
          span.end();

          // Wait for the BatchSpanProcessor to flush (interval: 1s) before navigating away.
          await new Promise((resolve) => {
            setTimeout(resolve, TracingInstrumentation.SCHEDULED_BATCH_DELAY_MS + 200);
          });

          window.location.assign('/oauth2/login');
        }

        throw new Error('Ikke innlogget');
      }

      if (res.status >= 500) {
        console.error(`Kunne ikke hente ${name}`, res.status, res.statusText);

        if (attempt >= 3) {
          throw new Error(`Kunne ikke hente ${name}`);
        }

        span.setStatus({ code: SpanStatusCode.ERROR, message: `Server error ${res.status}, retrying` });

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            loadStaticData<T>(url, name, attempt + 1)
              .then(resolve)
              .catch(reject);
          }, 1000);
        });
      }

      if (!res.ok) {
        throw new Error(`Kunne ikke hente ${name}`);
      }

      span.setStatus({ code: SpanStatusCode.OK });

      return await res.json();
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
