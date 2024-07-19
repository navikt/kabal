import { proxyRegister } from '@app/prometheus/types';
import { Counter, Gauge, Histogram } from 'prom-client';

const labelNames = ['hit'] as const;

export const redisCacheGauge = new Counter({
  name: 'obo_redis_cache',
  help: 'Number of requests to the Redis OBO cache. "hit" is the type of hit: "miss", "invalid", "hit" or "expired".',
  labelNames,
  registers: [proxyRegister],
});

export const redisCacheSizeGauge = new Gauge({
  name: 'obo_redis_cache_size',
  help: 'Number of OBO tokens in the Redis cache.',
  registers: [proxyRegister],
});

export const memoryCacheGauge = new Counter({
  name: 'obo_cache',
  help: 'Number of requests to the OBO cache. "hit" is the type of hit: "miss", "redis", "hit", or "expired".',
  labelNames,
  registers: [proxyRegister],
});

export const memoryCacheSizeGauge = new Gauge({
  name: 'obo_cache_size',
  help: 'Number of OBO tokens in the cache.',
  registers: [proxyRegister],
});

export const oboRequestDuration = new Histogram({
  name: 'obo_request_duration',
  help: 'Duration of OBO token requests in milliseconds.',
  buckets: [0, 10, 100, 200, 300, 400, 500, 600, 800, 900, 1_000],
  registers: [proxyRegister],
});
