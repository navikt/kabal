import { type HistoryEntry, HistorySource } from '@/components/smart-editor/history/types';

/** Stable string key uniquely identifying a history entry within a document. */
export const entryKey = (entry: HistoryEntry): string =>
  entry.source === HistorySource.API ? `api-${entry.version.toString(10)}` : `local-${entry.key}`;
