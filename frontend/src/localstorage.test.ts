import { describe, expect, it } from 'bun:test';
import { format, subDays } from 'date-fns';
import { BACKUP_KEY_DATE_FORMAT, KEY_PREFIX } from '@/components/smart-editor/tabbed-editors/constants';
import {
  cleanLocalStorage,
  deleteAllDocumentBackupsForBehandling,
  deleteDocumentBackups,
  type LocalStorage,
} from '@/localstorage';

interface TestLocalStorage extends LocalStorage {
  getItems: () => Record<string, string>;
}

const createMockLocalStorage = (items: Record<string, string>): TestLocalStorage => {
  const storage = new Map(Object.entries(items));

  return {
    get length() {
      return storage.size;
    },
    key(index: number): string | null {
      return storage.keys().toArray().at(index) ?? null;
    },
    removeItem(key: string): void {
      storage.delete(key);
    },
    setItem(key: string, value: string): void {
      storage.set(key, value);
    },
    getItem(key: string): string | null {
      return storage.get(key) ?? null;
    },
    getItems() {
      return Object.fromEntries(storage);
    },
  };
};

describe('cleanLocalStorage', () => {
  it('should not remove backups newer than 7 days', () => {
    expect.assertions(1);

    const recentDate = format(subDays(new Date(), 5), BACKUP_KEY_DATE_FORMAT);
    const mockStorage = createMockLocalStorage({
      [`${KEY_PREFIX}behandling1/doc1/${recentDate}`]: '"content"',
    });

    cleanLocalStorage(mockStorage);

    expect(mockStorage.getItems()).toEqual({
      [`${KEY_PREFIX}behandling1/doc1/${recentDate}`]: '"content"',
    });
  });

  it('should remove backups older than 7 days', () => {
    expect.assertions(1);

    const oldDate = format(subDays(new Date(), 8), BACKUP_KEY_DATE_FORMAT);
    const mockStorage = createMockLocalStorage({
      [`${KEY_PREFIX}behandling1/doc1/${oldDate}`]: '"content"',
    });

    cleanLocalStorage(mockStorage);

    expect(mockStorage.getItems()).toEqual({});
  });

  it('should keep backups exactly 7 days old', () => {
    expect.assertions(1);

    const exactlySevenDays = format(subDays(new Date(), 7), BACKUP_KEY_DATE_FORMAT);
    const mockStorage = createMockLocalStorage({
      [`${KEY_PREFIX}behandling1/doc1/${exactlySevenDays}`]: '"content"',
    });

    cleanLocalStorage(mockStorage);

    expect(mockStorage.getItems()).toEqual({
      [`${KEY_PREFIX}behandling1/doc1/${exactlySevenDays}`]: '"content"',
    });
  });

  it('should not touch non-backup keys', () => {
    expect.assertions(1);

    const oldDate = format(subDays(new Date(), 60), BACKUP_KEY_DATE_FORMAT);
    const mockStorage = createMockLocalStorage({
      'some-other-key': 'value',
      [`${KEY_PREFIX}behandling1/doc1/${oldDate}`]: '"content"',
      'another-key': 'another-value',
    });

    cleanLocalStorage(mockStorage);

    expect(mockStorage.getItems()).toEqual({
      'some-other-key': 'value',
      'another-key': 'another-value',
    });
  });

  it('should handle multiple backups with mixed ages', () => {
    expect.assertions(1);

    const recentDate1 = format(subDays(new Date(), 5), BACKUP_KEY_DATE_FORMAT);
    const recentDate2 = format(subDays(new Date(), 6), BACKUP_KEY_DATE_FORMAT);
    const oldDate = format(subDays(new Date(), 45), BACKUP_KEY_DATE_FORMAT);

    const mockStorage = createMockLocalStorage({
      [`${KEY_PREFIX}behandling1/doc1/${recentDate1}`]: '"recent1"',
      [`${KEY_PREFIX}behandling1/doc1/${oldDate}`]: '"old"',
      [`${KEY_PREFIX}behandling2/doc2/${recentDate2}`]: '"recent2"',
    });

    cleanLocalStorage(mockStorage);

    expect(mockStorage.getItems()).toEqual({
      [`${KEY_PREFIX}behandling1/doc1/${recentDate1}`]: '"recent1"',
      [`${KEY_PREFIX}behandling2/doc2/${recentDate2}`]: '"recent2"',
    });
  });

  it('should remove all old backups even when multiple need removal', () => {
    expect.assertions(1);

    const recentDate = format(subDays(new Date(), 5), BACKUP_KEY_DATE_FORMAT);
    const oldDate1 = format(subDays(new Date(), 45), BACKUP_KEY_DATE_FORMAT);
    const oldDate2 = format(subDays(new Date(), 60), BACKUP_KEY_DATE_FORMAT);
    const oldDate3 = format(subDays(new Date(), 90), BACKUP_KEY_DATE_FORMAT);

    const mockStorage = createMockLocalStorage({
      [`${KEY_PREFIX}behandling1/doc1/${recentDate}`]: '"recent"',
      [`${KEY_PREFIX}behandling1/doc2/${oldDate1}`]: '"old1"',
      [`${KEY_PREFIX}behandling2/doc1/${oldDate2}`]: '"old2"',
      [`${KEY_PREFIX}behandling2/doc2/${oldDate3}`]: '"old3"',
    });

    cleanLocalStorage(mockStorage);

    expect(mockStorage.getItems()).toEqual({
      [`${KEY_PREFIX}behandling1/doc1/${recentDate}`]: '"recent"',
    });
  });

  it('should handle empty localStorage', () => {
    expect.assertions(1);

    const mockStorage = createMockLocalStorage({});

    cleanLocalStorage(mockStorage);

    expect(mockStorage.getItems()).toEqual({});
  });

  it('should keep legacy minute-format backups within 7 days', () => {
    expect.assertions(1);

    const recentLegacyDate = format(subDays(new Date(), 5), BACKUP_KEY_DATE_FORMAT);
    const mockStorage = createMockLocalStorage({
      [`${KEY_PREFIX}behandling1/doc1/${recentLegacyDate}`]: '"content"',
    });

    cleanLocalStorage(mockStorage);

    expect(mockStorage.getItems()).toEqual({
      [`${KEY_PREFIX}behandling1/doc1/${recentLegacyDate}`]: '"content"',
    });
  });

  it('should remove keys with missing date part (invalid date)', () => {
    expect.assertions(1);

    const mockStorage = createMockLocalStorage({
      [`${KEY_PREFIX}behandling1/doc1`]: '"content"',
    });

    cleanLocalStorage(mockStorage);

    expect(mockStorage.getItems()).toEqual({});
  });

  it('should remove keys with invalid date format', () => {
    expect.assertions(1);

    const mockStorage = createMockLocalStorage({
      [`${KEY_PREFIX}behandling1/doc1/invalid-date`]: '"content"',
    });

    cleanLocalStorage(mockStorage);

    expect(mockStorage.getItems()).toEqual({});
  });
});

describe('deleteDocumentBackups', () => {
  it('should remove all backups for the given documents only', () => {
    expect.assertions(1);

    const date1 = format(subDays(new Date(), 1), BACKUP_KEY_DATE_FORMAT);
    const date2 = format(subDays(new Date(), 2), BACKUP_KEY_DATE_FORMAT);

    const mockStorage = createMockLocalStorage({
      [`${KEY_PREFIX}behandling1/doc1/${date1}`]: '"doc1-1"',
      [`${KEY_PREFIX}behandling1/doc1/${date2}`]: '"doc1-2"',
      [`${KEY_PREFIX}behandling1/doc2/${date1}`]: '"doc2"',
      [`${KEY_PREFIX}behandling1/doc3/${date1}`]: '"doc3"',
      [`${KEY_PREFIX}behandling1/doc10/${date1}`]: '"doc10"',
      [`${KEY_PREFIX}behandling2/doc1/${date1}`]: '"other-behandling"',
      'some-other-key': 'value',
    });

    deleteDocumentBackups('behandling1', ['doc1', 'doc2'], mockStorage);

    expect(mockStorage.getItems()).toEqual({
      [`${KEY_PREFIX}behandling1/doc3/${date1}`]: '"doc3"',
      [`${KEY_PREFIX}behandling1/doc10/${date1}`]: '"doc10"',
      [`${KEY_PREFIX}behandling2/doc1/${date1}`]: '"other-behandling"',
      'some-other-key': 'value',
    });
  });

  it('should do nothing when no document IDs are given', () => {
    expect.assertions(1);

    const date = format(subDays(new Date(), 1), BACKUP_KEY_DATE_FORMAT);
    const mockStorage = createMockLocalStorage({ [`${KEY_PREFIX}behandling1/doc1/${date}`]: '"content"' });

    deleteDocumentBackups('behandling1', [], mockStorage);

    expect(mockStorage.getItems()).toEqual({ [`${KEY_PREFIX}behandling1/doc1/${date}`]: '"content"' });
  });
});

describe('deleteAllDocumentBackupsForBehandling', () => {
  it('should remove all backups for the given behandling only', () => {
    expect.assertions(1);

    const date = format(subDays(new Date(), 1), BACKUP_KEY_DATE_FORMAT);

    const mockStorage = createMockLocalStorage({
      [`${KEY_PREFIX}behandling1/doc1/${date}`]: '"doc1"',
      [`${KEY_PREFIX}behandling1/doc2/${date}`]: '"doc2"',
      [`${KEY_PREFIX}behandling10/doc1/${date}`]: '"behandling10"',
      [`${KEY_PREFIX}behandling2/doc1/${date}`]: '"behandling2"',
      'some-other-key': 'value',
    });

    deleteAllDocumentBackupsForBehandling('behandling1', mockStorage);

    expect(mockStorage.getItems()).toEqual({
      [`${KEY_PREFIX}behandling10/doc1/${date}`]: '"behandling10"',
      [`${KEY_PREFIX}behandling2/doc1/${date}`]: '"behandling2"',
      'some-other-key': 'value',
    });
  });
});
