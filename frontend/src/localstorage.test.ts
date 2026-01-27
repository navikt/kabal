import { describe, expect, it } from 'bun:test';
import { BACKUP_DATE_FORMAT, KEY_PREFIX } from '@app/components/smart-editor/tabbed-editors/constants';
import { cleanLocalStorage, type LocalStorage } from '@app/localstorage';
import { format, subDays } from 'date-fns';

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
  it('should not remove backups newer than 30 days', () => {
    expect.assertions(1);

    const recentDate = format(subDays(new Date(), 5), BACKUP_DATE_FORMAT);
    const mockStorage = createMockLocalStorage({
      [`${KEY_PREFIX}oppgave1/doc1/${recentDate}`]: '"content"',
    });

    cleanLocalStorage(mockStorage);

    expect(mockStorage.getItems()).toEqual({
      [`${KEY_PREFIX}oppgave1/doc1/${recentDate}`]: '"content"',
    });
  });

  it('should remove backups older than 30 days', () => {
    expect.assertions(1);

    const oldDate = format(subDays(new Date(), 45), BACKUP_DATE_FORMAT);
    const mockStorage = createMockLocalStorage({
      [`${KEY_PREFIX}oppgave1/doc1/${oldDate}`]: '"content"',
    });

    cleanLocalStorage(mockStorage);

    expect(mockStorage.getItems()).toEqual({});
  });

  it('should keep backups exactly 30 days old', () => {
    expect.assertions(1);

    const exactlyThirtyDays = format(subDays(new Date(), 30), BACKUP_DATE_FORMAT);
    const mockStorage = createMockLocalStorage({
      [`${KEY_PREFIX}oppgave1/doc1/${exactlyThirtyDays}`]: '"content"',
    });

    cleanLocalStorage(mockStorage);

    expect(mockStorage.getItems()).toEqual({
      [`${KEY_PREFIX}oppgave1/doc1/${exactlyThirtyDays}`]: '"content"',
    });
  });

  it('should not touch non-backup keys', () => {
    expect.assertions(1);

    const oldDate = format(subDays(new Date(), 60), BACKUP_DATE_FORMAT);
    const mockStorage = createMockLocalStorage({
      'some-other-key': 'value',
      [`${KEY_PREFIX}oppgave1/doc1/${oldDate}`]: '"content"',
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

    const recentDate1 = format(subDays(new Date(), 5), BACKUP_DATE_FORMAT);
    const recentDate2 = format(subDays(new Date(), 10), BACKUP_DATE_FORMAT);
    const oldDate = format(subDays(new Date(), 45), BACKUP_DATE_FORMAT);

    const mockStorage = createMockLocalStorage({
      [`${KEY_PREFIX}oppgave1/doc1/${recentDate1}`]: '"recent1"',
      [`${KEY_PREFIX}oppgave1/doc1/${oldDate}`]: '"old"',
      [`${KEY_PREFIX}oppgave2/doc2/${recentDate2}`]: '"recent2"',
    });

    cleanLocalStorage(mockStorage);

    expect(mockStorage.getItems()).toEqual({
      [`${KEY_PREFIX}oppgave1/doc1/${recentDate1}`]: '"recent1"',
      [`${KEY_PREFIX}oppgave2/doc2/${recentDate2}`]: '"recent2"',
    });
  });

  it('should remove all old backups even when multiple need removal', () => {
    expect.assertions(1);

    const recentDate = format(subDays(new Date(), 5), BACKUP_DATE_FORMAT);
    const oldDate1 = format(subDays(new Date(), 45), BACKUP_DATE_FORMAT);
    const oldDate2 = format(subDays(new Date(), 60), BACKUP_DATE_FORMAT);
    const oldDate3 = format(subDays(new Date(), 90), BACKUP_DATE_FORMAT);

    const mockStorage = createMockLocalStorage({
      [`${KEY_PREFIX}oppgave1/doc1/${recentDate}`]: '"recent"',
      [`${KEY_PREFIX}oppgave1/doc2/${oldDate1}`]: '"old1"',
      [`${KEY_PREFIX}oppgave2/doc1/${oldDate2}`]: '"old2"',
      [`${KEY_PREFIX}oppgave2/doc2/${oldDate3}`]: '"old3"',
    });

    cleanLocalStorage(mockStorage);

    expect(mockStorage.getItems()).toEqual({
      [`${KEY_PREFIX}oppgave1/doc1/${recentDate}`]: '"recent"',
    });
  });

  it('should handle empty localStorage', () => {
    expect.assertions(1);

    const mockStorage = createMockLocalStorage({});

    cleanLocalStorage(mockStorage);

    expect(mockStorage.getItems()).toEqual({});
  });

  it('should remove keys with missing date part (invalid date)', () => {
    expect.assertions(1);

    const mockStorage = createMockLocalStorage({
      [`${KEY_PREFIX}oppgave1/doc1`]: '"content"',
    });

    cleanLocalStorage(mockStorage);

    expect(mockStorage.getItems()).toEqual({});
  });

  it('should remove keys with invalid date format', () => {
    expect.assertions(1);

    const mockStorage = createMockLocalStorage({
      [`${KEY_PREFIX}oppgave1/doc1/invalid-date`]: '"content"',
    });

    cleanLocalStorage(mockStorage);

    expect(mockStorage.getItems()).toEqual({});
  });

  describe('pdf rotation items', () => {
    it('should remove rotation keys with value "0"', () => {
      expect.assertions(1);

      const mockStorage = createMockLocalStorage({
        'A123456/pdf/abc123/rotation': '0',
      });

      cleanLocalStorage(mockStorage);

      expect(mockStorage.getItems()).toEqual({});
    });

    it('should keep rotation keys with non-zero values', () => {
      expect.assertions(1);

      const mockStorage = createMockLocalStorage({
        'A123456/pdf/abc123/rotation': '90',
        'B654321/pdf/def456/rotation': '180',
        'C111111/pdf/xyz789/rotation': '270',
      });

      cleanLocalStorage(mockStorage);

      expect(mockStorage.getItems()).toEqual({
        'A123456/pdf/abc123/rotation': '90',
        'B654321/pdf/def456/rotation': '180',
        'C111111/pdf/xyz789/rotation': '270',
      });
    });

    it('should handle mixed rotation values', () => {
      expect.assertions(1);

      const mockStorage = createMockLocalStorage({
        'A123456/pdf/abc123/rotation': '0',
        'B654321/pdf/def456/rotation': '90',
        'C111111/pdf/xyz789/rotation': '0',
        'D222222/pdf/ghi012/rotation': '180',
      });

      cleanLocalStorage(mockStorage);

      expect(mockStorage.getItems()).toEqual({
        'B654321/pdf/def456/rotation': '90',
        'D222222/pdf/ghi012/rotation': '180',
      });
    });

    it('should not remove keys that do not match rotation pattern', () => {
      expect.assertions(1);

      const mockStorage = createMockLocalStorage({
        'some-random-key': '0',
        'A123456/pdf/abc123/other': '0',
        '123456/pdf/abc123/rotation': '0', // Missing letter prefix
        'AB123456/pdf/abc123/rotation': '0', // Too many letters
        'A12345/pdf/abc123/rotation': '0', // Too few digits
        'A1234567/pdf/abc123/rotation': '0', // Too many digits
      });

      cleanLocalStorage(mockStorage);

      expect(mockStorage.getItems()).toEqual({
        'some-random-key': '0',
        'A123456/pdf/abc123/other': '0',
        '123456/pdf/abc123/rotation': '0',
        'AB123456/pdf/abc123/rotation': '0',
        'A12345/pdf/abc123/rotation': '0',
        'A1234567/pdf/abc123/rotation': '0',
      });
    });

    it('should handle rotation keys with alphanumeric document IDs', () => {
      expect.assertions(1);

      const mockStorage = createMockLocalStorage({
        'A123456/pdf/ABC123def/rotation': '0',
        'B654321/pdf/xyz789ABC/rotation': '90',
        'C111111/pdf/a1b2c3d4e5/rotation': '0',
      });

      cleanLocalStorage(mockStorage);

      expect(mockStorage.getItems()).toEqual({
        'B654321/pdf/xyz789ABC/rotation': '90',
      });
    });

    it('should handle both backup keys and rotation keys together', () => {
      expect.assertions(1);

      const recentDate = format(subDays(new Date(), 5), BACKUP_DATE_FORMAT);
      const oldDate = format(subDays(new Date(), 45), BACKUP_DATE_FORMAT);

      const mockStorage = createMockLocalStorage({
        [`${KEY_PREFIX}oppgave1/doc1/${recentDate}`]: '"recent"',
        [`${KEY_PREFIX}oppgave1/doc1/${oldDate}`]: '"old"',
        'A123456/pdf/abc123/rotation': '0',
        'B654321/pdf/def456/rotation': '90',
        'some-other-key': 'value',
      });

      cleanLocalStorage(mockStorage);

      expect(mockStorage.getItems()).toEqual({
        [`${KEY_PREFIX}oppgave1/doc1/${recentDate}`]: '"recent"',
        'B654321/pdf/def456/rotation': '90',
        'some-other-key': 'value',
      });
    });
  });
});
