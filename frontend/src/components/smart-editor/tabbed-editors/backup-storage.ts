import { format as formatDate, isValid, parse } from 'date-fns';
import { parseBackupDateFromKey } from '@/components/smart-editor/tabbed-editors/backup-date';
import { BACKUP_DATE_FORMAT } from '@/components/smart-editor/tabbed-editors/constants';
import { isObject } from '@/functions/object';
import { parseJSON } from '@/functions/parse-json';
import type { KabalValue } from '@/plate/types';
import type { INavEmployee } from '@/types/bruker';

interface BaseBackup {
  content: KabalValue;
  modified: string;
}

interface StoredBackup extends BaseBackup {
  /** ISO datetime (seconds precision) for when the document was last modified. */
  modified: string;
  author: INavEmployee;
  content: KabalValue;
}

export interface ParsedBackup extends BaseBackup {
  modified: string;
  /** null for legacy backups that store no author. */
  author: INavEmployee | null;
}

export const serializeBackup = (content: KabalValue, modified: string, author: INavEmployee): string =>
  JSON.stringify({ modified, author, content } satisfies StoredBackup);

export const parseBackup = (raw: string, key: string): ParsedBackup | null => {
  const parsed = parseJSON<unknown>(raw);

  // Legacy backups stored the bare KabalValue array with no metadata.
  if (Array.isArray(parsed)) {
    const modified = parseLegacyModified(key);

    return modified === null ? null : { content: parsed, modified, author: null };
  }

  if (isStoredBackup(parsed)) {
    const date = parse(parsed.modified, BACKUP_DATE_FORMAT, new Date(0));

    if (!isValid(date)) {
      return null;
    }

    return { content: parsed.content, modified: formatDate(date, BACKUP_DATE_FORMAT), author: parsed.author };
  }

  return null;
};

/** Extracts and validates the date segment from a legacy backup key, normalising it to BACKUP_DATE_FORMAT. */
const parseLegacyModified = (key: string): string | null => {
  const date = parseBackupDateFromKey(key);

  return date === null ? null : formatDate(date, BACKUP_DATE_FORMAT);
};

const isStoredBackup = (value: unknown): value is StoredBackup =>
  isObject(value) && typeof value.modified === 'string' && Array.isArray(value.content) && isNavEmployee(value.author);

const isNavEmployee = (value: unknown): value is INavEmployee =>
  isObject(value) && typeof value.navIdent === 'string' && typeof value.navn === 'string';
