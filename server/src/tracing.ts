import { FastifyOtelInstrumentation } from '@fastify/otel';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { DnsInstrumentation } from '@opentelemetry/instrumentation-dns';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NetInstrumentation } from '@opentelemetry/instrumentation-net';
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis';
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

export const fastifyOtelInstrumentation = new FastifyOtelInstrumentation();

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'kabal-frontend-bff',
  }),
  spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter()),
  instrumentations: [
    new DnsInstrumentation(),
    new HttpInstrumentation(),
    new NetInstrumentation(),
    new UndiciInstrumentation(),
    new RedisInstrumentation(),
    fastifyOtelInstrumentation,
  ],
});

sdk.start();

export const shutdownTracing = () => sdk.shutdown();
