import { describe, expect, it, mock, spyOn } from 'bun:test';
import { waitFor } from '@/helpers/wait-for.test-utils';
import { type GetLeadership, Leadership } from '@/leader-election';
import { createMemoryHighlightRepository } from '@/plugins/highlights/repository';
import { startSnapshotMetrics } from '@/plugins/highlights/snapshot-metrics';
import type { HighlightDocument } from '@/plugins/highlights/types';
import { proxyRegister } from '@/prometheus/types';

const HIGHLIGHT = {
  id: 'h1',
  pageIndex: 0,
  source: 'pdf',
  rects: [{ x: 0.1, y: 0.1, width: 0.5, height: 0.02 }],
  text: 'Tekst',
  createdAt: 1,
};

const DOCUMENT: HighlightDocument = { behandlingId: 'b1', documentId: '1', format: 'ARKIV', navIdent: 'Z1' };

// Use with `await using`, so it stops even when the test fails. Running loops would write to the shared gauges.
describe('highlight snapshot metrics', () => {
  it('scans on start and on every interval, and reports 0 for sources and formats without highlights', async () => {
    const repository = createMemoryHighlightRepository();
    const scan = spyOn(repository, 'scan');
    await repository.save(DOCUMENT, { added: [HIGHLIGHT], removedIds: [] });

    await using _metrics = startSnapshotMetrics({ repository, scanIntervalMs: 20, leadershipCheckIntervalMs: 5 });
    await waitFor(async () => (await getValue('highlights_users')) === 1);

    expect(await getValue('highlights_count', { source: 'pdf' })).toBe(1);
    expect(await getValue('highlights_count', { source: 'ocr' })).toBe(0);
    expect(await getValue('highlights_entries', { format: 'ARKIV' })).toBe(1);
    expect(await getValue('highlights_per_entry', { stat: 'max' })).toBe(1);

    await repository.save(DOCUMENT, { added: [], removedIds: ['h1'] });
    await waitFor(async () => (await getValue('highlights_users')) === 0);

    expect(await getValue('highlights_count', { source: 'pdf' })).toBe(0);
    expect(await getValue('highlights_entries', { format: 'ARKIV' })).toBe(0);
    expect(await getValue('highlights_per_entry', { stat: 'max' })).toBeUndefined();
    expect(scan.mock.calls.length).toBeGreaterThan(1);
  });

  it('stops scanning when stopped', async () => {
    const repository = createMemoryHighlightRepository();
    const scan = spyOn(repository, 'scan');

    await using metrics = startSnapshotMetrics({ repository, scanIntervalMs: 20, leadershipCheckIntervalMs: 5 });
    await metrics.stop();
    await Bun.sleep(50);

    expect(scan).toHaveBeenCalledTimes(1);
  });

  it('aborts a running scan when stopped', async () => {
    const repository = createMemoryHighlightRepository();
    const scan = spyOn(repository, 'scan').mockImplementation(untilAborted);

    await using metrics = startSnapshotMetrics({ repository, scanIntervalMs: 60_000 });
    await waitFor(async () => scan.mock.calls.length === 1);

    // Times out unless stopping aborts the wait.
    await metrics.stop();
  });

  it('only scans on the leader, and resets the gauges on other pods', async () => {
    const repository = createMemoryHighlightRepository();
    const scan = spyOn(repository, 'scan');
    await repository.save(DOCUMENT, { added: [HIGHLIGHT], removedIds: [] });
    const getLeadership = mock<GetLeadership>().mockResolvedValue(Leadership.LEADER);

    await using _metrics = startSnapshotMetrics({
      repository,
      scanIntervalMs: 20,
      leadershipCheckIntervalMs: 5,
      getLeadership,
    });
    await waitFor(async () => (await getValue('highlights_users')) === 1);

    getLeadership.mockResolvedValue(Leadership.FOLLOWER);
    await waitFor(async () => (await getValue('highlights_users')) === 0);
    const scans = scan.mock.calls.length;
    await Bun.sleep(50);

    expect(scan).toHaveBeenCalledTimes(scans);
    expect(await getValue('highlights_count', { source: 'pdf' })).toBeUndefined();
    expect(await getValue('highlights_snapshot_timestamp_seconds')).toBe(0);
  });

  it('scans as soon as it becomes the leader, and only once per interval', async () => {
    const repository = createMemoryHighlightRepository();
    const scan = spyOn(repository, 'scan');
    const getLeadership = mock<GetLeadership>().mockResolvedValue(Leadership.FOLLOWER);

    await using _metrics = startSnapshotMetrics({
      repository,
      scanIntervalMs: 60_000,
      leadershipCheckIntervalMs: 5,
      getLeadership,
    });
    await waitFor(async () => getLeadership.mock.calls.length >= 2);
    expect(scan).not.toHaveBeenCalled();

    getLeadership.mockResolvedValue(Leadership.LEADER);
    await waitFor(async () => scan.mock.calls.length === 1);
    const polls = getLeadership.mock.calls.length;
    await waitFor(async () => getLeadership.mock.calls.length >= polls + 3);

    expect(scan).toHaveBeenCalledTimes(1);
  });

  it('resets the gauges when the elector fails', async () => {
    const repository = createMemoryHighlightRepository();
    await repository.save(DOCUMENT, { added: [HIGHLIGHT], removedIds: [] });
    const getLeadership = mock<GetLeadership>()
      .mockResolvedValueOnce(Leadership.LEADER)
      .mockRejectedValue(new Error('Elector is down'));

    await using _metrics = startSnapshotMetrics({
      repository,
      scanIntervalMs: 60_000,
      leadershipCheckIntervalMs: 20,
      getLeadership,
    });
    await waitFor(async () => (await getValue('highlights_users')) === 1);
    await waitFor(async () => (await getValue('highlights_users')) === 0);

    expect(await getValue('highlights_count', { source: 'pdf' })).toBeUndefined();
  });

  it('retries a failed scan on the next leadership check, and reports when the last scan succeeded', async () => {
    const repository = createMemoryHighlightRepository();
    const scan = spyOn(repository, 'scan').mockRejectedValueOnce(new Error('Valkey is down'));
    await repository.save(DOCUMENT, { added: [HIGHLIGHT], removedIds: [] });
    const startedAt = Math.floor(Date.now() / 1_000);

    await using _metrics = startSnapshotMetrics({ repository, scanIntervalMs: 60_000, leadershipCheckIntervalMs: 5 });
    await waitFor(async () => (await getValue('highlights_users')) === 1);

    expect(scan).toHaveBeenCalledTimes(2);
    expect(await getValue('highlights_snapshot_timestamp_seconds')).toBeGreaterThanOrEqual(startedAt);
  });

  it('stops while waiting for leadership', async () => {
    const repository = createMemoryHighlightRepository();
    const scan = spyOn(repository, 'scan');
    // Like an elector that never answers.
    const getLeadership = mock<GetLeadership>(untilAborted);

    await using metrics = startSnapshotMetrics({ repository, getLeadership });
    await waitFor(async () => getLeadership.mock.calls.length === 1);

    // Times out unless stopping aborts the wait.
    await metrics.stop();
    expect(getLeadership).toHaveBeenCalledTimes(1);
    expect(scan).not.toHaveBeenCalled();
  });
});

/** Settles only when `signal` aborts, like a hanging scan or elector. */
const untilAborted = (signal: AbortSignal | undefined): Promise<never> =>
  new Promise((_, reject) => signal?.addEventListener('abort', () => reject(signal.reason), { once: true }));

const getValue = async (name: string, labels: Record<string, string> = {}): Promise<number | undefined> => {
  const metric = await proxyRegister.getSingleMetric(name)?.get();

  return metric?.values.find((value) => Object.entries(labels).every(([key, label]) => value.labels[key] === label))
    ?.value;
};
