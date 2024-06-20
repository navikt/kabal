import { describe, expect, it } from 'bun:test';
import { formatDuration } from '@app/helpers/duration';

describe('format duration', () => {
  it('should format 12.123 ms as 12 ms', () => {
    expect.assertions(1);
    const actual = formatDuration(12.123);
    const expected = '12ms';
    expect(actual).toBe(expected);
  });

  it('should format 500 ms as 500 ms', () => {
    expect.assertions(1);
    const actual = formatDuration(500);
    const expected = '500ms';
    expect(actual).toBe(expected);
  });

  it('should format 1_000 ms as 1 second', () => {
    expect.assertions(1);
    const actual = formatDuration(1_000);
    const expected = '1.000s';
    expect(actual).toBe(expected);
  });

  it('should format 10_000 ms as 10 seconds', () => {
    expect.assertions(1);
    const actual = formatDuration(10_000);
    const expected = '10.000s';
    expect(actual).toBe(expected);
  });

  it('should format 60_000 ms as 1 minute', () => {
    expect.assertions(1);
    const actual = formatDuration(60_000);
    const expected = '1m0.000s';
    expect(actual).toBe(expected);
  });

  it('should format 600_000 ms as 10 minute', () => {
    expect.assertions(1);
    const actual = formatDuration(600_000);
    const expected = '10m0.000s';
    expect(actual).toBe(expected);
  });

  it('should format 6_000_000 ms as 1 hour, 40 minutes and 0 seconds', () => {
    expect.assertions(1);
    const actual = formatDuration(6_000_000);
    const expected = '1h40m0.000s';
    expect(actual).toBe(expected);
  });

  it('should format 6_000_750 ms as 1 hour, 40 minutes and 0.750 second', () => {
    expect.assertions(1);
    const actual = formatDuration(6_000_750);
    const expected = '1h40m0.750s';
    expect(actual).toBe(expected);
  });

  it('should format 6_750_750 ms as 1 hour, 40 minutes and 30.750 second', () => {
    expect.assertions(1);
    const actual = formatDuration(6_750_750);
    const expected = '1h52m30.750s';
    expect(actual).toBe(expected);
  });
});
