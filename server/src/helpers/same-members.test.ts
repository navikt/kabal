import { describe, expect, it } from 'bun:test';
import { sameMembers } from '@/helpers/same-members';

describe('sameMembers', () => {
  it('should treat two empty lists as equal', () => {
    expect(sameMembers([], [])).toBe(true);
  });

  it('should ignore order', () => {
    expect(sameMembers(['A', 'B', 'C'], ['C', 'A', 'B'])).toBe(true);
  });

  it('should ignore duplicates', () => {
    expect(sameMembers(['A', 'A', 'B'], ['A', 'B'])).toBe(true);
  });

  it('should detect a different member', () => {
    expect(sameMembers(['A', 'B'], ['A', 'C'])).toBe(false);
  });

  it('should detect a different size', () => {
    expect(sameMembers(['A'], ['A', 'B'])).toBe(false);
  });

  it('should detect an empty vs non-empty list', () => {
    expect(sameMembers([], ['A'])).toBe(false);
  });
});
