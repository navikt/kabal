import { describe, expect, it } from 'bun:test';
import type { HighlightEntry, HighlightSummary } from '@/plugins/highlights/repository';
import { computeHighlightStatistics, DistributionName, getDistribution } from '@/plugins/highlights/statistics';

const DAY_MS = 24 * 60 * 60 * 1_000;
const NOW = 10 * DAY_MS;

const getHighlight = (text = 'Tekst', ageDays = 0): HighlightSummary => ({
  source: 'pdf',
  textLength: text.length,
  createdAt: NOW - ageDays * DAY_MS,
});

const getEntry = (
  behandlingId: string,
  documentId: string,
  navIdent: string,
  highlights: HighlightSummary[],
): HighlightEntry => ({ behandlingId, documentId, navIdent, format: 'ARKIV', highlights });

describe('highlight statistics', () => {
  it('counts totals and distinct values, and only entries with highlights', () => {
    const statistics = computeHighlightStatistics(
      {
        entries: [
          getEntry('b1', 'd1', 'Z1', [getHighlight(), { ...getHighlight(), source: 'ocr' }]),
          getEntry('b1', 'd1', 'Z2', [getHighlight()]),
          getEntry('b1', 'd2', 'Z1', [getHighlight()]),
          { ...getEntry('b2', 'd3', 'Z3', [getHighlight()]), format: 'SLADDET' },
          getEntry('b3', 'd4', 'Z4', []),
        ],
        finishedMarkerCount: 4,
      },
      NOW,
    );

    expect(statistics.highlightsBySource).toEqual(
      new Map([
        ['pdf', 4],
        ['ocr', 1],
      ]),
    );
    expect(statistics.entriesByFormat).toEqual(
      new Map([
        ['ARKIV', 3],
        ['SLADDET', 1],
      ]),
    );
    expect(statistics.documentCount).toBe(3);
    expect(statistics.userCount).toBe(3);
    expect(statistics.behandlingCount).toBe(2);
    expect(statistics.finishedMarkerCount).toBe(4);
    expect(statistics.distributions[DistributionName.PER_ENTRY]).toEqual({
      min: 1,
      p50: 1,
      p90: 2,
      p99: 2,
      max: 2,
      mean: 1.25,
    });
    expect(statistics.distributions[DistributionName.PER_BEHANDLING]?.max).toBe(4);
    expect(statistics.distributions[DistributionName.DOCUMENTS_PER_BEHANDLING]?.max).toBe(2);
    expect(statistics.distributions[DistributionName.USERS_PER_BEHANDLING]?.max).toBe(2);
  });

  it('measures text length and age of each highlight', () => {
    const statistics = computeHighlightStatistics(
      {
        entries: [getEntry('b1', 'd1', 'Z1', [getHighlight('ab', 1), getHighlight('abcdef', 3)])],
        finishedMarkerCount: 0,
      },
      NOW,
    );

    expect(statistics.distributions[DistributionName.TEXT_LENGTH]).toMatchObject({ min: 2, max: 6, mean: 4 });
    expect(statistics.distributions[DistributionName.AGE_DAYS]).toMatchObject({ min: 1, max: 3, mean: 2 });
  });

  it('counts highlights created in the future as new', () => {
    const statistics = computeHighlightStatistics(
      { entries: [getEntry('b1', 'd1', 'Z1', [getHighlight('ab', -1)])], finishedMarkerCount: 0 },
      NOW,
    );

    expect(statistics.distributions[DistributionName.AGE_DAYS]).toMatchObject({ min: 0, max: 0 });
  });

  it('has no distributions without highlights', () => {
    const statistics = computeHighlightStatistics(
      { entries: [getEntry('b1', 'd1', 'Z1', [])], finishedMarkerCount: 0 },
      NOW,
    );

    expect(statistics.documentCount).toBe(0);
    expect(Object.values(statistics.distributions).every((distribution) => distribution === null)).toBe(true);
  });

  it('uses nearest-rank percentiles', () => {
    const values = Array.from({ length: 100 }, (_, index) => 100 - index);

    expect(getDistribution(values)).toEqual({ min: 1, p50: 50, p90: 90, p99: 99, max: 100, mean: 50.5 });
    expect(getDistribution([7])).toEqual({ min: 7, p50: 7, p90: 7, p99: 7, max: 7, mean: 7 });
    expect(getDistribution([])).toBeNull();
  });
});
