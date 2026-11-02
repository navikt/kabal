import { describe, expect, it } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { Histogram, Registry } from '@prometheus-io/client';
import { kafkaPrometheus } from '@/document-access/kafka-prometheus';

class UnsupportedRegistry {
  internalState = 'do-not-log-registry-contents';
}

const runInvalidConfig = (cluster: string, configuration: string) =>
  spawnSync(
    process.execPath,
    [
      '--eval',
      `
        import { kafkaPrometheus } from ${JSON.stringify(import.meta.resolve('./kafka-prometheus.ts'))};
        class UnsupportedRegistry {
          internalState = 'do-not-log-registry-contents';
        }
        ${configuration}
      `,
    ],
    {
      encoding: 'utf8',
      env: {
        ...process.env,
        NODE_ENV: 'test',
        NAIS_CLUSTER_NAME: cluster,
        AZURE_APP_CLIENT_ID: 'test-client',
        AZURE_APP_WELL_KNOWN_URL: 'https://auth.invalid',
        NAIS_APP_NAME: 'test-app',
        VERSION: 'test-version',
      },
    },
  );

describe('kafkaPrometheus', () => {
  describe.each(
    Object.entries({
      Counter: kafkaPrometheus.Counter,
      Gauge: kafkaPrometheus.Gauge,
      Histogram: kafkaPrometheus.Histogram,
    }),
  )('%s', (_name, Metric) => {
    it('registers labeled metrics in every supplied registry', async () => {
      const first = new Registry();
      const second = new kafkaPrometheus.Registry();
      const metric = new Metric({
        name: 'kafka_test_metric',
        help: 'Kafka test metric',
        registers: [first, second],
        labelNames: ['kind'],
      });

      if (metric instanceof Histogram) {
        metric.labels({ kind: 'test' }).observe(2);
      } else {
        metric.labels({ kind: 'test' }).inc(2);
      }

      expect(first.getSingleMetric('kafka_test_metric')).toBe(metric);
      expect(second.getSingleMetric('kafka_test_metric')).toBe(metric);
      expect(await first.metrics()).toContain('kind="test"');
      expect(await second.metrics()).toBe(await first.metrics());
    });

    it('rejects unsupported registries before registering the metric anywhere', () => {
      const registry = new Registry();

      expect(
        () =>
          new Metric({
            name: 'kafka_test_metric',
            help: 'Kafka test metric',
            registers: [registry, {}],
          }),
      ).toThrow(
        new TypeError(
          'Invalid registry for Kafka metric "kafka_test_metric" at registers[1]: expected @prometheus-io/client Registry, received Object',
        ),
      );

      expect(registry.getSingleMetric('kafka_test_metric')).toBeUndefined();
    });

    it.each([
      { registry: null, type: 'null' },
      { registry: undefined, type: 'undefined' },
      { registry: 'not-a-registry', type: 'string' },
      { registry: new UnsupportedRegistry(), type: 'UnsupportedRegistry' },
      { registry: Object.create(null), type: 'object' },
    ])('identifies the unsupported registry type (%p)', ({ registry, type }) => {
      expect(
        () =>
          new Metric({
            name: 'kafka_test_metric',
            help: 'Kafka test metric',
            registers: [registry],
          }),
      ).toThrow(
        new TypeError(
          `Invalid registry for Kafka metric "kafka_test_metric" at registers[0]: expected @prometheus-io/client Registry, received ${type}`,
        ),
      );
    });

    it('allows an explicitly empty registry list', () => {
      expect(
        () =>
          new Metric({
            name: 'kafka_test_metric',
            help: 'Kafka test metric',
            registers: [],
          }),
      ).not.toThrow();
    });
  });

  describe('Registry', () => {
    it('defaults to the Prometheus content type', () => {
      expect(new kafkaPrometheus.Registry().contentType).toBe(Registry.PROMETHEUS_CONTENT_TYPE);
    });

    it.each([Registry.PROMETHEUS_CONTENT_TYPE, Registry.OPENMETRICS_CONTENT_TYPE])(
      'preserves the supported content type %s',
      (contentType) => {
        expect(new kafkaPrometheus.Registry(contentType).contentType).toBe(contentType);
      },
    );

    it('rejects unsupported content types', () => {
      expect(() => new kafkaPrometheus.Registry('text/html')).toThrow(
        new TypeError('Content type text/html is unsupported'),
      );
    });
  });

  describe.each(['none', 'dev-gcp'])('startup logging in %s', (cluster) => {
    it('logs actionable registry errors before they escape', () => {
      const result = runInvalidConfig(
        cluster,
        `new kafkaPrometheus.Counter({
          name: 'kafka_test_metric',
          help: 'Kafka test metric',
          registers: [new kafkaPrometheus.Registry(), new UnsupportedRegistry()],
        });`,
      );
      const firstLog = result.stderr.slice(0, result.stderr.indexOf('\n'));
      const output: unknown = cluster === 'dev-gcp' ? JSON.parse(firstLog) : { message: firstLog };

      expect(result.status).toBe(1);
      expect(output).toMatchObject({
        message: expect.stringContaining(
          'Invalid registry for Kafka metric "kafka_test_metric" at registers[1]: expected @prometheus-io/client Registry, received UnsupportedRegistry',
        ),
      });
      expect(firstLog).not.toContain('do-not-log-registry-contents');

      if (cluster === 'dev-gcp') {
        expect(output).toMatchObject({
          level: 'error',
          module: 'kafka-prometheus',
          metric_name: 'kafka_test_metric',
          registry_index: 1,
          registry_type: 'UnsupportedRegistry',
          stacktrace: expect.stringContaining('TypeError: Invalid registry for Kafka metric'),
        });
      } else {
        expect(firstLog).toStartWith('Invalid Kafka metrics configuration - TypeError:');
      }
    });

    it('logs rejected content types before they escape', () => {
      const result = runInvalidConfig(cluster, "new kafkaPrometheus.Registry('text/html');");
      const firstLog = result.stderr.slice(0, result.stderr.indexOf('\n'));

      expect(result.status).toBe(1);
      expect(firstLog).toContain('Content type text/html is unsupported');

      if (cluster === 'dev-gcp') {
        expect(JSON.parse(firstLog)).toMatchObject({
          level: 'error',
          module: 'kafka-prometheus',
          content_type: 'text/html',
          supported_content_types: [Registry.PROMETHEUS_CONTENT_TYPE, Registry.OPENMETRICS_CONTENT_TYPE],
          stacktrace: expect.stringContaining('TypeError: Content type text/html is unsupported'),
        });
      } else {
        expect(firstLog).toStartWith('Invalid Kafka metrics registry content type - TypeError:');
      }
    });
  });
});
