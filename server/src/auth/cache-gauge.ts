import { proxyRegister } from '@app/prometheus/types';
import { Counter, Gauge } from 'prom-client';

const labelNames = ['hit'] as const;

export const cacheGauge = new Counter({
  name: 'obo_cache',
  help: 'Number of requests to the OBO cache. "hit" is the type of hit: "miss", "hit", or "expired".',
  labelNames,
  registers: [proxyRegister],
});

export const cacheSizeGauge = new Gauge({
  name: 'obo_cache_size',
  help: 'Number of OBO tokens in the cache.',
  registers: [proxyRegister],
});
