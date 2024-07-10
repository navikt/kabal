import { proxyRegister } from '@app/prometheus/types';
import { Counter } from 'prom-client';

const labelNames = ['hit'] as const;

export const cacheGauge = new Counter({
  name: 'obo_cache',
  help: 'Number of requests to the OBO cache. "hit" is the type of hit: "miss", "hit", or "expired".',
  labelNames,
  registers: [proxyRegister],
});
