import { BACKUP_DATE_FORMAT, KEY_PREFIX } from '@app/components/smart-editor/tabbed-editors/constants';
import { toast } from '@app/components/toast/store';
import { isValid, parse } from 'date-fns';

export interface LocalStorage {
  length: number;
  key(index: number): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
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
        const datePart = key.split('/').at(-1);

        if (datePart === undefined) {
          ls.removeItem(key);
          continue;
        }

        const backupDate = parse(datePart, BACKUP_DATE_FORMAT, new Date());

        if (!isValid(backupDate)) {
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
