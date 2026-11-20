import { describe, expect, it } from 'bun:test';
import { Consumer } from '@platformatic/kafka';
import { Counter } from '@prometheus-io/client';
import { fastify } from 'fastify';
import metricsPlugin from 'fastify-metrics';
import { kafkaPrometheus } from '@/kafka/kafka-prometheus';
import { proxyRegister } from '@/prometheus/types';

const COUNTER_NAME = 'metrics_endpoint_test_total';
const COUNTER_SAMPLE = new RegExp(`^${COUNTER_NAME}\\{.*\\} 1$`, 'm');
const KAFKA_SAMPLE = /^kafka_consumers\{/m;

const getMetricNames = () => new Set(proxyRegister.getMetricsAsArray().map(({ name }) => name));

/** Unregisters metrics added since `existing`, so the shared registry is left as the test found it. */
const removeAddedMetrics = (existing: Set<string>) => {
  for (const name of getMetricNames()) {
    if (!existing.has(name)) {
      proxyRegister.removeSingleMetric(name);
    }
  }
};

describe('/metrics', () => {
  // fastify-metrics serves its own Prometheus client's registry, so metrics registered anywhere else are silently dropped.
  it('serves application and Kafka metrics registered on proxyRegister', async () => {
    const existingMetrics = getMetricNames();

    new Counter({ name: COUNTER_NAME, help: 'Test counter', registers: [proxyRegister] }).inc();

    const consumer = new Consumer({
      groupId: 'metrics-endpoint-test',
      clientId: 'metrics-endpoint-test',
      bootstrapBrokers: ['broker.kafka.invalid:9092'],
      metrics: { registry: proxyRegister, client: kafkaPrometheus },
    });

    const app = fastify();

    try {
      await app.register(metricsPlugin, { endpoint: '/metrics' });

      const { statusCode, body } = await app.inject('/metrics');

      expect(statusCode).toBe(200);
      expect(body).toMatch(COUNTER_SAMPLE);
      expect(body).toMatch(KAFKA_SAMPLE);
    } finally {
      await app.close();
      await consumer.close();
      removeAddedMetrics(existingMetrics);
    }
  });
});
