import { Histogram } from 'prom-client';
import { registers } from '@app/prometheus/types';

export const histogram = new Histogram({
  name: 'session_duration_seconds',
  help: 'Duration of user sessions in seconds',
  buckets: [5, 10, 30, 60, 90, 120, 150, 180, 210, 240, 300, 360, 420, 480, 540, 600, 660, 720].map((n) => n * 60),
  registers,
});
