import { proxyRegister } from '@app/prometheus/types';
import { Gauge, Summary } from 'prom-client';

export const labelNames = ['document_id'] as const;

export type LabelNames = (typeof labelNames)[number];

export const accessListDocumentCountGauge = new Gauge({
  name: 'access_list_document_count',
  help: 'Number of documents in the access list map.',
  labelNames,
  registers: [proxyRegister],
});

export const accessListUserCountSummary = new Summary({
  name: 'access_list_user_count_summary',
  help: 'Summary of the number of users (Nav-ident) per document in access lists.',
  registers: [proxyRegister],
  percentiles: [0.5, 0.9, 0.99],
});
