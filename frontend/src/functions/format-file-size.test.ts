import { describe, expect, it } from 'vitest';
import { BYTES_PER_KB, formatFileSize } from '@app/functions/format-file-size';

const KB = BYTES_PER_KB;
const MB = KB * BYTES_PER_KB;
const GB = MB * BYTES_PER_KB;

describe('format file size', () => {
  it('negative bytes should throw an error', () => {
    expect.assertions(1);

    expect(() => {
      formatFileSize(-1);
    }).toThrow('Size cannot be negative');
  });

  it('1 byte should be formatted as 1 byte', () => {
    expect.assertions(1);

    const actual = formatFileSize(1);
    expect(actual).toBe('1 byte');
  });

  it('200 byte should be formatted as 200 byte', () => {
    expect.assertions(1);

    const actual = formatFileSize(200);
    expect(actual).toBe('200 byte');
  });

  it(`${2 * KB} byte should be formatted as 2 KiB`, () => {
    expect.assertions(1);

    const actual = formatFileSize(2 * KB);
    expect(actual).toBe('2.00 KiB');
  });

  it(`${2 * MB} byte should be formatted as 2 MiB`, () => {
    expect.assertions(1);

    const actual = formatFileSize(2 * MB);
    expect(actual).toBe('2.00 MiB');
  });

  it(`${5.73 * MB} byte should be formatted as 5.73 MiB`, () => {
    expect.assertions(1);

    const actual = formatFileSize(5.73 * MB);
    expect(actual).toBe('5.73 MiB');
  });

  it(`${5.59073 * GB} byte should be formatted as 5.59 GiB`, () => {
    expect.assertions(1);

    const actual = formatFileSize(5.59073 * GB);
    expect(actual).toBe('5.59 GiB');
  });
});
