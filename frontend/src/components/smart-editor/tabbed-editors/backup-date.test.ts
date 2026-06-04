import { describe, expect, it } from 'bun:test';
import { format } from 'date-fns';
import { parseBackupDateFromKey } from '@/components/smart-editor/tabbed-editors/backup-date';
import { BACKUP_KEY_DATE_FORMAT, KEY_PREFIX } from '@/components/smart-editor/tabbed-editors/constants';

const toKey = (date: string): string => `${KEY_PREFIX}oppgave1/doc1/${date}`;

describe('parseBackupDateFromKey', () => {
  it('should parse a valid key', () => {
    expect.assertions(1);

    const date = new Date(2026, 5, 4, 10, 35, 0);

    expect(parseBackupDateFromKey(toKey(format(date, BACKUP_KEY_DATE_FORMAT)))).toEqual(date);
  });

  it('should return null for a key with a date segment that is too short', () => {
    expect.assertions(1);

    expect(parseBackupDateFromKey(toKey('2026-06-04T10'))).toBeNull();
  });

  it('should return null for a key with a date segment that is too long', () => {
    expect.assertions(1);

    expect(parseBackupDateFromKey(toKey('2026-06-04T10:35:12'))).toBeNull();
  });

  it('should return null for a key with an invalid date', () => {
    expect.assertions(1);

    expect(parseBackupDateFromKey(toKey('2026-13-04T10:35'))).toBeNull();
  });
});
