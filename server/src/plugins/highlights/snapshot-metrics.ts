import { setTimeout as sleep } from 'node:timers/promises';
import { Gauge } from '@prometheus-io/client';
import { type GetLeadership, getLeadership as getPodLeadership, Leadership } from '@/leader-election';
import { getLogger } from '@/logger';
import type { HighlightRepository } from '@/plugins/highlights/repository';
import {
  computeHighlightStatistics,
  type Distribution,
  DistributionName,
  type HighlightStatistics,
} from '@/plugins/highlights/statistics';
import { HIGHLIGHT_FORMATS, HIGHLIGHT_SOURCES } from '@/plugins/highlights/types';
import { proxyRegister } from '@/prometheus/types';

const log = getLogger('highlights-snapshot-metrics');

const SCAN_INTERVAL_MS = 5 * 60_000;
// The elector is a local sidecar, so asking is cheap.
const LEADERSHIP_CHECK_INTERVAL_MS = 10_000;

const TIMESTAMP_NAME = 'highlights_snapshot_timestamp_seconds';

/** Only the leader pod reports values. The others report nothing or 0, so query with `max` across pods. */
const createGauge = (name: string, help: string, labelNames: string[] = []) =>
  new Gauge({
    name,
    help: `${help} Reported by the leader pod, use max. Example: ${getExample(name, labelNames)}`,
    labelNames,
    registers: [proxyRegister],
  });

/**
 * Without a snapshot, like right after startup, labeled gauges have no values, but unlabeled gauges report 0.
 * Their examples skip that 0 by requiring a snapshot timestamp, so it isn't mistaken for an empty store.
 */
const getExample = (name: string, labelNames: string[]): string => {
  if (labelNames.length > 0) {
    return `max by (${labelNames.join(', ')}) (${name})`;
  }

  return name === TIMESTAMP_NAME ? `max(${name})` : `max(${name}) and on() max(${TIMESTAMP_NAME}) > 0`;
};

const countGauge = createGauge('highlights_count', 'Stored highlights.', ['source']);
const entriesGauge = createGauge('highlights_entries', 'Document variants with highlights, one per user.', ['format']);
const documentsGauge = createGauge('highlights_documents', 'Distinct documents with highlights.');
const usersGauge = createGauge('highlights_users', 'Distinct users with highlights.');
const behandlingerGauge = createGauge('highlights_behandlinger', 'Behandlinger with highlights.');
const finishedMarkersGauge = createGauge('highlights_finished_markers', 'Behandlinger marked as finished.');
const durationGauge = createGauge(
  'highlights_snapshot_duration_seconds',
  'How long the last snapshot took to compute.',
);
// Reset with the other gauges, so it tells a missing snapshot from an empty store.
const timestampGauge = createGauge(
  TIMESTAMP_NAME,
  'When the reported values were computed, in Unix seconds. 0 when no pod has a snapshot. Use `time() - max(...)` to see how old the values are.',
);

const DISTRIBUTION_HELP: Record<DistributionName, string> = {
  [DistributionName.PER_ENTRY]: 'Highlights per user per document variant.',
  [DistributionName.PER_BEHANDLING]: 'Highlights per behandling.',
  [DistributionName.DOCUMENTS_PER_BEHANDLING]: 'Documents with highlights per behandling.',
  [DistributionName.USERS_PER_BEHANDLING]: 'Users with highlights per behandling.',
  [DistributionName.TEXT_LENGTH]: 'Text length per highlight, in characters.',
  [DistributionName.AGE_DAYS]: 'Age per highlight, in days.',
};

const distributionGauges = new Map(
  Object.values(DistributionName).map((name) => [
    name,
    createGauge(`highlights_${name}`, `${DISTRIBUTION_HELP[name]} Exact statistics.`, ['stat']),
  ]),
);

const GAUGES = [
  countGauge,
  entriesGauge,
  documentsGauge,
  usersGauge,
  behandlingerGauge,
  finishedMarkersGauge,
  durationGauge,
  timestampGauge,
  ...distributionGauges.values(),
];

export interface SnapshotMetricsOptions {
  repository: HighlightRepository;
  scanIntervalMs?: number;
  leadershipCheckIntervalMs?: number;
  getLeadership?: GetLeadership;
}

export interface SnapshotMetrics extends AsyncDisposable {
  /** Aborts a running scan between pages, and waits for it so it doesn't fail on a closed repository. */
  stop: () => Promise<void>;
}

/**
 * Checks leadership every `leadershipCheckIntervalMs`. The leader scans all highlights when it becomes the leader, then every `scanIntervalMs`.
 * A failed scan is retried on the next leadership check.
 * The other pods, and a pod whose elector fails, reset their gauges.
 */
export const startSnapshotMetrics = ({
  repository,
  scanIntervalMs = SCAN_INTERVAL_MS,
  leadershipCheckIntervalMs = LEADERSHIP_CHECK_INTERVAL_MS,
  getLeadership = getPodLeadership,
}: SnapshotMetricsOptions): SnapshotMetrics => {
  const controller = new AbortController();
  const { signal } = controller;
  // When this pod last scanned as the leader. `null` makes it scan as soon as it is the leader.
  let lastScanAt: number | null = null;
  // Whether the last scan failed, so a failure is only logged once.
  let failing = false;

  const forget = () => {
    resetGauges();
    lastScanAt = null;
  };

  const scan = async () => {
    try {
      const start = performance.now();
      const scanned = await repository.scan(signal);
      const statistics = computeHighlightStatistics(scanned, Date.now());
      const durationMs = performance.now() - start;

      setGauges(statistics, durationMs);
      const roundedMs = Math.round(durationMs);
      log.debug({
        msg: `Computed highlight snapshot metrics in ${roundedMs.toString(10)} ms`,
        data: { duration_ms: roundedMs },
      });

      if (failing) {
        failing = false;
        log.info({ msg: 'Computing highlight snapshot metrics recovered' });
      }
    } catch (error) {
      // Stopped mid-scan on shutdown.
      if (signal.aborted) {
        return;
      }

      if (!failing) {
        failing = true;
        log.warn({ msg: 'Failed to compute highlight snapshot metrics. Retrying on every leadership check.', error });
      }

      // Stale values would look current.
      resetGauges();
      // Retries on the next leadership check, instead of after the scan interval.
      lastScanAt = null;
    }
  };

  const update = async () => {
    // Without an answer, this pod may have lost leadership. The elector client logs the failure.
    const leadership = await getLeadership(signal).catch(() => null);

    if (leadership !== Leadership.LEADER) {
      forget();

      return;
    }

    if (lastScanAt === null || performance.now() - lastScanAt >= scanIntervalMs) {
      lastScanAt = performance.now();
      await scan();
    }
  };

  const loop = async () => {
    while (!signal.aborted) {
      await update();
      // Rejects only when aborted.
      await sleep(leadershipCheckIntervalMs, undefined, { signal }).catch(() => undefined);
    }
  };

  const running = loop();

  const stop = async () => {
    controller.abort();
    await running;
  };

  return { stop, [Symbol.asyncDispose]: stop };
};

const setGauges = (statistics: HighlightStatistics, durationMs: number) => {
  resetGauges();

  // Every known label, so one without highlights reports 0 instead of disappearing.
  for (const source of HIGHLIGHT_SOURCES) {
    countGauge.set({ source }, statistics.highlightsBySource.get(source) ?? 0);
  }

  for (const format of HIGHLIGHT_FORMATS) {
    entriesGauge.set({ format }, statistics.entriesByFormat.get(format) ?? 0);
  }

  documentsGauge.set(statistics.documentCount);
  usersGauge.set(statistics.userCount);
  behandlingerGauge.set(statistics.behandlingCount);
  finishedMarkersGauge.set(statistics.finishedMarkerCount);
  durationGauge.set(durationMs / 1_000);
  timestampGauge.setToCurrentTime();

  for (const [name, gauge] of distributionGauges) {
    setDistribution(gauge, statistics.distributions[name]);
  }
};

/** Labeled gauges lose their values. Unlabeled gauges report 0, which never wins the `max` across pods. */
const resetGauges = () => {
  for (const gauge of GAUGES) {
    gauge.reset();
  }
};

const setDistribution = (gauge: Gauge<string>, distribution: Distribution | null) => {
  if (distribution === null) {
    return;
  }

  for (const [stat, value] of Object.entries(distribution)) {
    gauge.set({ stat }, value);
  }
};
