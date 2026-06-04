import { useEffect, useState } from 'react';
import { HistorySource, type LocalHistoryEntry } from '@/components/smart-editor/history/types';
import { parseBackup } from '@/components/smart-editor/tabbed-editors/backup-storage';
import { BACKUP_EVENT_NAME, KEY_PREFIX } from '@/components/smart-editor/tabbed-editors/constants';
import { isObject } from '@/functions/object';

interface BackupEventDetail {
  key: string;
}

const buildPrefix = (oppgaveId: string, documentId: string): string => `${KEY_PREFIX}${oppgaveId}/${documentId}/`;

const readEntries = (oppgaveId: string, documentId: string): LocalHistoryEntry[] => {
  const prefix = buildPrefix(oppgaveId, documentId);
  const entries: LocalHistoryEntry[] = [];

  for (let i = window.localStorage.length - 1; i >= 0; i--) {
    const key = window.localStorage.key(i);

    if (key === null || !key.startsWith(prefix)) {
      continue;
    }

    const raw = window.localStorage.getItem(key);

    if (raw === null) {
      continue;
    }

    const parsed = parseBackup(raw, key);

    if (parsed === null) {
      continue;
    }

    entries.push({
      source: HistorySource.LOCAL,
      key,
      content: parsed.content,
      author: parsed.author,
      timestamp: parsed.modified,
    });
  }

  return entries.toSorted(sortByTimestampDesc);
};

export const useLocalHistory = (oppgaveId: string, documentId: string): LocalHistoryEntry[] => {
  const [entries, setEntries] = useState<LocalHistoryEntry[]>(() => readEntries(oppgaveId, documentId));

  useEffect(() => {
    // Re-read all entries immediately when oppgaveId/documentId changes (e.g. switching document tabs).
    setEntries(readEntries(oppgaveId, documentId));

    const updateEntry = (key: string, raw: string | null) => {
      const parsed = raw === null ? null : parseBackup(raw, key);

      setEntries((prev) => {
        const withoutKey = prev.filter((entry) => entry.key !== key);

        if (parsed === null) {
          return withoutKey;
        }

        return withoutKey
          .concat({
            source: HistorySource.LOCAL,
            key,
            content: parsed.content,
            author: parsed.author,
            timestamp: parsed.modified,
          })
          .toSorted(sortByTimestampDesc);
      });
    };

    const handleCustomEvent = (event: Event) => {
      if (!(event instanceof CustomEvent)) {
        return;
      }

      const { detail } = event;

      if (!isBackupEventDetail(detail) || !detail.key.startsWith(buildPrefix(oppgaveId, documentId))) {
        return;
      }

      updateEntry(detail.key, window.localStorage.getItem(detail.key));
    };

    const handleStorageEvent = ({ key, newValue }: StorageEvent) => {
      if (key?.startsWith(buildPrefix(oppgaveId, documentId)) === true) {
        updateEntry(key, newValue);
      }
    };

    // `storage` event does not fire in the writing tab. Custom event is used to notify same-tab listeners.
    window.addEventListener(BACKUP_EVENT_NAME, handleCustomEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener(BACKUP_EVENT_NAME, handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [oppgaveId, documentId]);

  return entries;
};

const isBackupEventDetail = (value: unknown): value is BackupEventDetail =>
  isObject(value) && typeof value.key === 'string';

const sortByTimestampDesc = (a: LocalHistoryEntry, b: LocalHistoryEntry): number =>
  b.timestamp.localeCompare(a.timestamp);
