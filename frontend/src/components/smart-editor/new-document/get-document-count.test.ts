import { describe, expect, it } from '@jest/globals';
import { getDocumentCount } from './get-document-count';

describe('calculate document count', () => {
  it('should return 0 for no documents', () => {
    expect.assertions(1);
    const result = getDocumentCount([], d`bar`);
    expect(result).toBe(0);
  });

  it('should return 0 for no matches', () => {
    expect.assertions(1);
    const result = getDocumentCount([d`foo`, d`baz`], d`bar`);
    expect(result).toBe(0);
  });

  it('should return 1 for one exact match', () => {
    expect.assertions(1);
    const result = getDocumentCount([d`foo`, d`bar`, d`baz`], d`bar`);
    expect(result).toBe(1);
  });

  it('should return 1 for multiple exact match', () => {
    expect.assertions(1);
    const result = getDocumentCount([d`foo`, d`bar`, d`bar`], d`bar`);
    expect(result).toBe(1);
  });

  it('should return 2 as the next count after 1', () => {
    expect.assertions(1);
    const result = getDocumentCount([d`foo`, d`bar (1)`, d`bar`], d`bar`);
    expect(result).toBe(2);
  });

  it('should return 1 as the first available count in [2, 3]', () => {
    expect.assertions(1);
    const result = getDocumentCount([d`bar`, d`bar (2)`, d`bar (3)`], d`bar`);
    expect(result).toBe(1);
  });

  it('should return 3 as the first available count in [1, 2, 4, 5]', () => {
    expect.assertions(1);
    const result = getDocumentCount([d`bar (2)`, d`bar (5)`, d`bar (1)`, d`bar (4)`], d`bar`);
    expect(result).toBe(3);
  });
});

const d = (tittel: TemplateStringsArray): { tittel: string } => ({ tittel: tittel.toString() });
