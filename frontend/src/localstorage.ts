import { isBefore, isSameDay, subDays } from 'date-fns';
import { parseBackupDateFromKey } from '@/components/smart-editor/tabbed-editors/backup-date';
import { BACKUP_EVENT_NAME, KEY_PREFIX } from '@/components/smart-editor/tabbed-editors/constants';
import { toast } from '@/components/toast/store';
import { pushError } from '@/observability';

const TTL_DAYS = 7;

export interface LocalStorage {
  length: number;
  key(index: number): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
  getItem(key: string): string | null;
}

export const setLocalStorageItem = (
  key: string,
  value: string,
  ls: LocalStorage = window.localStorage,
  attempt = 0,
) => {
  try {
    ls.setItem(key, value);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      deleteOldestBackups(ls, 10); // Try to free up space by deleting old backups
      console.warn(
        'localStorage quota exceeded when setting key "%s" (%s). Deleted oldest backups to free up space.',
        key,
        value.length,
      );
      if (attempt < 10) {
        setLocalStorageItem(key, value, ls, attempt + 1); // Retry setting the item
      } else {
        toast.error(
          'Kabal opplever problemer med lagringsplassen på din enhet, ta kontakt med Team Klage på Teams (Tilbakemelding til KABAL).',
        );
        console.error('Failed to set localStorage item for key "%s" after multiple attempts - quota may be full.', key);
      }
    } else if (error instanceof Error) {
      console.error('Failed to set localStorage item for key "%s" - %s - %s', key, error.name, error.message);
    } else {
      console.error('Failed to set localStorage item for key "%s"', key, error);
    }
  }
};

export const deleteOldestBackups = (ls: LocalStorage, count: number) => {
  try {
    const backups: { key: string; date: Date }[] = [];

    for (let i = ls.length - 1; i >= 0; i--) {
      const key = ls.key(i);

      if (key?.startsWith(KEY_PREFIX) === true) {
        const backupDate = parseBackupDateFromKey(key);

        if (backupDate === null) {
          ls.removeItem(key);
          continue;
        }

        backups.push({ key, date: backupDate });
      }
    }

    const toDelete = backups
      .toSorted((a, b) => a.date.getTime() - b.date.getTime()) // Sort by date ascending (oldest first)
      .slice(0, count);

    for (const { key } of toDelete) {
      ls.removeItem(key);
    }
  } catch (error) {
    console.error('Failed to delete oldest localStorage backups', error);
  }
};

export const cleanLocalStorage = (ls: LocalStorage) => {
  // Keep 7 days of backups in localStorage
  try {
    const cutoff = subDays(new Date(), TTL_DAYS);

    // Iterate backwards to avoid index shifting issues when removing items
    for (let i = ls.length - 1; i >= 0; i--) {
      const key = ls.key(i);

      if (key === null) {
        continue;
      }

      if (key.startsWith(KEY_PREFIX)) {
        const backupDate = parseBackupDateFromKey(key);

        if (backupDate === null || (isBefore(backupDate, cutoff) && !isSameDay(backupDate, cutoff))) {
          ls.removeItem(key);
        }
      }
    }
  } catch (error) {
    console.error('Failed to clean up localStorage backups', error);
  }
};

/** Deletes all local backups (local history) for the given smart documents. */
export const deleteDocumentBackups = (
  oppgaveId: string,
  documentIds: readonly string[],
  ls: LocalStorage = window.localStorage,
) => {
  if (documentIds.length === 0) {
    return;
  }

  try {
    removeBackupsWithPrefix(
      documentIds.map((documentId) => `${KEY_PREFIX}${oppgaveId}/${documentId}/`),
      ls,
    );
  } catch (error) {
    console.error('Failed to delete localStorage backups for documents', error);

    const context = { oppgaveId, documentIds: documentIds.join(',') };

    if (error instanceof Error) {
      pushError(error, { context });
    } else {
      pushError(new Error('Failed to delete localStorage backups for documents'), { context });
    }
  }
};

/** Deletes all local backups (local history) for every smart document in the given behandling. */
export const deleteAllDocumentBackupsForBehandling = (oppgaveId: string, ls: LocalStorage = window.localStorage) => {
  try {
    removeBackupsWithPrefix([`${KEY_PREFIX}${oppgaveId}/`], ls);
  } catch (error) {
    console.error('Failed to delete localStorage backups for behandling', error);

    const context = { oppgaveId };

    if (error instanceof Error) {
      pushError(error, { context });
    } else {
      pushError(new Error('Failed to delete localStorage backups for behandling'), { context });
    }
  }
};

const removeBackupsWithPrefix = (prefixes: readonly string[], ls: LocalStorage) => {
  // Iterate backwards to avoid index shifting issues when removing items
  for (let i = ls.length - 1; i >= 0; i--) {
    const key = ls.key(i);

    if (key !== null && prefixes.some((prefix) => key.startsWith(prefix))) {
      ls.removeItem(key);
      // `storage` event does not fire in the writing tab. Custom event is used to notify same-tab listeners.
      window.dispatchEvent(new CustomEvent(BACKUP_EVENT_NAME, { detail: { key } }));
    }
  }
};
