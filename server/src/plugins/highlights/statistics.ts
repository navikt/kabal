import type { MarkerHighlightSource } from '@navikt/klage-file-viewer/highlights';
import type { HighlightEntry, HighlightScan } from '@/plugins/highlights/repository';
import type { HighlightFormat } from '@/plugins/highlights/types';

export interface Distribution {
  min: number;
  p50: number;
  p90: number;
  p99: number;
  max: number;
  mean: number;
}

export enum DistributionName {
  PER_ENTRY = 'per_entry',
  PER_BEHANDLING = 'per_behandling',
  DOCUMENTS_PER_BEHANDLING = 'documents_per_behandling',
  USERS_PER_BEHANDLING = 'users_per_behandling',
  TEXT_LENGTH = 'text_length',
  AGE_DAYS = 'age_days',
}

/**
 * - Entry: one user's highlights in one document variant.
 * - Document: a distinct document ID, across users and formats.
 * Only entries with highlights count. Distributions are `null` without samples.
 */
export interface HighlightStatistics {
  highlightsBySource: Map<MarkerHighlightSource, number>;
  entriesByFormat: Map<HighlightFormat, number>;
  documentCount: number;
  userCount: number;
  behandlingCount: number;
  finishedMarkerCount: number;
  distributions: Record<DistributionName, Distribution | null>;
}

const DAY_MS = 24 * 60 * 60 * 1_000;

export const computeHighlightStatistics = (
  { entries, finishedMarkerCount }: HighlightScan,
  now: number,
): HighlightStatistics => {
  const withHighlights = entries.filter(({ highlights }) => highlights.length > 0);
  const highlights = withHighlights.flatMap((entry) => entry.highlights);
  const behandlinger = Map.groupBy(withHighlights, ({ behandlingId }) => behandlingId);

  return {
    highlightsBySource: countBy(highlights, ({ source }) => source),
    entriesByFormat: countBy(withHighlights, ({ format }) => format),
    documentCount: countDistinct(withHighlights, ({ documentId }) => documentId),
    userCount: countDistinct(withHighlights, ({ navIdent }) => navIdent),
    behandlingCount: behandlinger.size,
    finishedMarkerCount,
    distributions: {
      [DistributionName.PER_ENTRY]: getDistribution(withHighlights.map((entry) => entry.highlights.length)),
      [DistributionName.PER_BEHANDLING]: getDistribution(mapGroups(behandlinger, sumHighlights)),
      [DistributionName.DOCUMENTS_PER_BEHANDLING]: getDistribution(
        mapGroups(behandlinger, (group) => countDistinct(group, ({ documentId }) => documentId)),
      ),
      [DistributionName.USERS_PER_BEHANDLING]: getDistribution(
        mapGroups(behandlinger, (group) => countDistinct(group, ({ navIdent }) => navIdent)),
      ),
      [DistributionName.TEXT_LENGTH]: getDistribution(highlights.map(({ textLength }) => textLength)),
      // A browser clock ahead of the server's would make the age negative.
      [DistributionName.AGE_DAYS]: getDistribution(
        highlights.map(({ createdAt }) => Math.max(now - createdAt, 0) / DAY_MS),
      ),
    },
  };
};

/** Exact values. Percentiles use the nearest-rank method. */
export const getDistribution = (values: number[]): Distribution | null => {
  const sorted = values.toSorted((a, b) => a - b);
  const min = sorted.at(0);
  const max = sorted.at(-1);

  if (min === undefined || max === undefined) {
    return null;
  }

  return {
    min,
    p50: getPercentile(sorted, 0.5),
    p90: getPercentile(sorted, 0.9),
    p99: getPercentile(sorted, 0.99),
    max,
    mean: sorted.reduce((sum, value) => sum + value, 0) / sorted.length,
  };
};

/** `sorted` must not be empty. */
const getPercentile = (sorted: number[], percentile: number): number =>
  sorted[Math.max(Math.ceil(percentile * sorted.length) - 1, 0)] ?? Number.NaN;

const sumHighlights = (entries: HighlightEntry[]): number =>
  entries.reduce((sum, { highlights }) => sum + highlights.length, 0);

const countDistinct = <T, K>(items: T[], getKey: (item: T) => K): number => new Set(items.map(getKey)).size;

const countBy = <T, K>(items: T[], getKey: (item: T) => K): Map<K, number> => {
  const counts = new Map<K, number>();

  for (const item of items) {
    const key = getKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return counts;
};

const mapGroups = <T, K>(groups: Map<K, T[]>, map: (group: T[]) => number): number[] =>
  Array.from(groups.values(), map);
