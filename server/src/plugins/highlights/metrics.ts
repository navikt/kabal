import { Counter, Gauge } from '@prometheus-io/client';
import { BehandlingStatus } from '@/plugins/highlights/behandling-status';
import { proxyRegister } from '@/prometheus/types';

/** Counted by each pod, so query with `sum` across pods. */
export const openStreamsGauge = new Gauge({
  name: 'highlights_open_streams',
  help: 'Open highlight event streams. Counted by each pod, use sum. Example: sum(highlights_open_streams)',
  registers: [proxyRegister],
});

export const streamRequestsCounter = new Counter({
  name: 'highlights_stream_requests_total',
  help: 'Highlight event stream requests, by the behandling status they got. Counted by each pod, use sum. Example: sum by (status) (increase(highlights_stream_requests_total[1h]))',
  labelNames: ['status'] as const,
  registers: [proxyRegister],
});

export enum ChangeType {
  ADDED = 'added',
  REMOVED = 'removed',
  REJECTED = 'rejected',
  COVERED = 'covered',
}

export const changesCounter = new Counter({
  name: 'highlights_changes_total',
  help: 'Highlight changes. "rejected" are additions not applied. "covered" are highlights removed because a new highlight covers them. Counted by each pod, use sum. Example: sum by (type) (increase(highlights_changes_total[1d]))',
  labelNames: ['type'] as const,
  registers: [proxyRegister],
});

// Starts every label at 0, so `increase()` also counts the first increment after startup.
for (const status of Object.values(BehandlingStatus)) {
  streamRequestsCounter.inc({ status }, 0);
}

for (const type of Object.values(ChangeType)) {
  changesCounter.inc({ type }, 0);
}
