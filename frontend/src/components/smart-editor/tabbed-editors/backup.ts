import { pushError } from '@app/observability';
import type { KabalValue } from '@app/plate/types';
import { format, isBefore, isSameDay, isValid, parse, subDays } from 'date-fns';

export const BACKUP_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm";
export const KEY_PREFIX = 'smart-document-backup/';
export const TTL_DAYS = 30;

export const createLocalStorageBackup = (oppgaveId: string, documentId: string, content: KabalValue) =>
  requestIdleCallback(
    () => {
      const now = new Date();
      const roundedMinute = Math.round(now.getMinutes() / 5) * 5; // 5 minute resolution
      now.setMinutes(roundedMinute);
      now.setSeconds(0);
      now.setMilliseconds(0);
      try {
        localStorage.setItem(
          `${KEY_PREFIX}${oppgaveId}/${documentId}/${format(now, BACKUP_DATE_FORMAT)}`,
          JSON.stringify(content),
        );
      } catch (error) {
        if (error instanceof Error) {
          pushError(new Error(`Failed to backup smart document to localStorage - ${error.name} - ${error.message}`), {
            context: { documentId, oppgaveId },
          });
        }

        console.error('Failed to backup smart document to localStorage', error);
      }
    },
    { timeout: 100 },
  );

interface LocalStorage {
  length: number;
  key(index: number): string | null;
  removeItem(key: string): void;
}

// Keep 30 days of backups in localStorage
export const cleanupLocalStorageBackups = (ls: LocalStorage) => {
  try {
    const cutoff = subDays(new Date(), TTL_DAYS);

    // Iterate backwards to avoid index shifting issues when removing items
    for (let i = ls.length - 1; i >= 0; i--) {
      const key = ls.key(i);

      if (key?.startsWith(KEY_PREFIX) === true) {
        const datePart = key.split('/').at(-1);

        if (datePart === undefined) {
          continue;
        }

        const backupDate = parse(datePart, BACKUP_DATE_FORMAT, new Date());

        if (!isValid(backupDate) || (isBefore(backupDate, cutoff) && !isSameDay(backupDate, cutoff))) {
          ls.removeItem(key);
        }
      }
    }
  } catch (error) {
    console.error('Failed to clean up localStorage backups', error);
  }
};
