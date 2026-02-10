import { describe, expect, it } from 'bun:test';
import { getCounts } from '@app/components/smart-editor-texts/hjemler-select/hooks';
import { GLOBAL, LIST_DELIMITER, NONE, WILDCARD } from '@app/components/smart-editor-texts/types';

describe('getCounts', () => {
  it('should return zero counts for an empty selection', () => {
    expect(getCounts([])).toEqual({ ytelserCount: 0, hjemlerCount: 0 });
  });

  it('should skip NONE values', () => {
    expect(getCounts([NONE])).toEqual({ ytelserCount: 0, hjemlerCount: 0 });
  });

  it('should not count multiple NONE values', () => {
    expect(getCounts([NONE, NONE, NONE])).toEqual({ ytelserCount: 0, hjemlerCount: 0 });
  });

  it('should count global hjemler (GLOBAL>hjemmelId) as hjemler', () => {
    const globalHjemmel = `${GLOBAL}${LIST_DELIMITER}hjemmel-123`;
    expect(getCounts([globalHjemmel])).toEqual({ ytelserCount: 0, hjemlerCount: 1 });
  });

  it('should count bare ytelse IDs (no delimiter) as ytelser', () => {
    expect(getCounts(['ytelse-1'])).toEqual({ ytelserCount: 1, hjemlerCount: 0 });
  });

  it('should count multiple bare ytelser', () => {
    expect(getCounts(['ytelse-1', 'ytelse-2', 'ytelse-3'])).toEqual({ ytelserCount: 3, hjemlerCount: 0 });
  });

  it('should count wildcard ytelser (ytelseId>*) as ytelser', () => {
    const wildcardYtelse = `ytelse-1${LIST_DELIMITER}${WILDCARD}`;
    expect(getCounts([wildcardYtelse])).toEqual({ ytelserCount: 1, hjemlerCount: 0 });
  });

  it('should count multiple wildcard ytelser as ytelser', () => {
    const selected = [`ytelse-1${LIST_DELIMITER}${WILDCARD}`, `ytelse-2${LIST_DELIMITER}${WILDCARD}`];
    expect(getCounts(selected)).toEqual({ ytelserCount: 2, hjemlerCount: 0 });
  });

  it('should count ytelse-specific hjemler (ytelseId>hjemmelId) as hjemler', () => {
    const hjemmel = `ytelse-1${LIST_DELIMITER}hjemmel-456`;
    expect(getCounts([hjemmel])).toEqual({ ytelserCount: 0, hjemlerCount: 1 });
  });

  it('should correctly classify a mixed selection', () => {
    const selected = [
      NONE,
      'ytelse-1',
      'ytelse-2',
      `ytelse-3${LIST_DELIMITER}${WILDCARD}`,
      `ytelse-1${LIST_DELIMITER}hjemmel-1`,
      `ytelse-2${LIST_DELIMITER}hjemmel-2`,
      `ytelse-1${LIST_DELIMITER}hjemmel-3`,
      `${GLOBAL}${LIST_DELIMITER}hjemmel-4`,
      `${GLOBAL}${LIST_DELIMITER}hjemmel-5`,
    ];

    expect(getCounts(selected)).toEqual({ ytelserCount: 3, hjemlerCount: 5 });
  });

  it('should not count bare GLOBAL (group container, not a selectable value)', () => {
    expect(getCounts([GLOBAL])).toEqual({ ytelserCount: 0, hjemlerCount: 0 });
  });

  it('should not count GLOBAL-prefixed values without the delimiter', () => {
    expect(getCounts([`${GLOBAL}-something`])).toEqual({ ytelserCount: 0, hjemlerCount: 0 });
  });

  it('should not count any invalid GLOBAL-prefixed values in a mixed selection', () => {
    const selected = [GLOBAL, `${GLOBAL}-something`, `${GLOBAL}xyz`, `${GLOBAL}${LIST_DELIMITER}hjemmel-1`, 'ytelse-1'];

    expect(getCounts(selected)).toEqual({ ytelserCount: 1, hjemlerCount: 1 });
  });
});
