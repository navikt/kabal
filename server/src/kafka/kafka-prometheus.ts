import { Counter, Gauge, Histogram, Registry, type RegistryContentType } from '@prometheus-io/client';
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
  const registries = registers.filter((registry) => registry instanceof Registry);

  if (registries.length === registers.length) {
    return { ...rest, registers: registries };
  }

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

const isRegistryContentType = (contentType: string): contentType is RegistryContentType =>
  contentType === Registry.PROMETHEUS_CONTENT_TYPE || contentType === Registry.OPENMETRICS_CONTENT_TYPE;

/**
 * Kafka never constructs a registry itself, but types the content type as any string.
 * Narrow it to the content types @prometheus-io/client supports.
 */
class KafkaRegistry extends Registry {
  constructor(contentType?: string) {
    if (contentType !== undefined && !isRegistryContentType(contentType)) {
      throw new TypeError(`Content type ${contentType} is unsupported`);
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
