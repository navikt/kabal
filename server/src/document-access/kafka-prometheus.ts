import { Counter, Gauge, Histogram, Registry } from '@prometheus-io/client';
import { isObject } from '@/functions/functions';
import { getLogger } from '@/logger';

const log = getLogger('kafka-prometheus');

interface Options {
  name: string;
  help: string;
  registers: unknown[];
  labelNames?: string[];
}

const getRegistryType = (registry: unknown): string => {
  if (registry === null) {
    return 'null';
  }

  if (isObject(registry) && typeof registry.constructor === 'function') {
    return registry.constructor.name;
  }

  return typeof registry;
};

/**
 * Kafka's structural Registry type is broader than @prometheus-io/client's.
 * Validate registry instances to narrow the types without dropping registries.
 */
const validateMetricOptions = ({ registers, ...rest }: Options) => {
  if (!registers.every((registry) => registry instanceof Registry)) {
    const registryIndex = registers.findIndex((registry) => !(registry instanceof Registry));
    const registryType = getRegistryType(registers[registryIndex]);
    const error = new TypeError(
      `Invalid registry for Kafka metric "${rest.name}" at registers[${registryIndex}]: expected @prometheus-io/client Registry, received ${registryType}`,
    );

    log.error({
      msg: 'Invalid Kafka metrics configuration',
      error,
      data: { metric_name: rest.name, registry_index: registryIndex, registry_type: registryType },
    });

    throw error;
  }

  return { ...rest, registers };
};

class KafkaCounter extends Counter<string> {
  constructor(options: Options) {
    super(validateMetricOptions(options));
  }
}

class KafkaGauge extends Gauge<string> {
  constructor(options: Options) {
    super(validateMetricOptions(options));
  }
}

class KafkaHistogram extends Histogram<string> {
  constructor(options: Options) {
    super(validateMetricOptions(options));
  }
}

class KafkaRegistry extends Registry {
  constructor(contentType?: string) {
    if (
      contentType !== undefined &&
      contentType !== Registry.OPENMETRICS_CONTENT_TYPE &&
      contentType !== Registry.PROMETHEUS_CONTENT_TYPE
    ) {
      const error = new TypeError(`Content type ${contentType} is unsupported`);

      log.error({
        msg: 'Invalid Kafka metrics registry content type',
        error,
        data: {
          content_type: contentType,
          supported_content_types: [Registry.PROMETHEUS_CONTENT_TYPE, Registry.OPENMETRICS_CONTENT_TYPE],
        },
      });

      throw error;
    }

    super(contentType);
  }
}

export const kafkaPrometheus = {
  Counter: KafkaCounter,
  Gauge: KafkaGauge,
  Histogram: KafkaHistogram,
  Registry: KafkaRegistry,
};
