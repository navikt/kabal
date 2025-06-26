import { describe, expect, it } from 'bun:test';
import {
  getRangeDirection,
  indexesToRanges,
  insertIndexIntoRange,
  isInRange,
  isRangeCollapsed,
  mergeRanges,
  mergeTwoRanges,
  RangeDirection,
  rangesToIndexes,
  rangeToIndexes,
  removeIndexFromRange,
  removeIndexFromRanges,
  type SelectionRange,
} from '@app/components/documents/journalfoerte-documents/select-context/range-utils';

describe('getRangeDirection', () => {
  it('should return FORWARD for forward range', () => {
    expect(getRangeDirection(r(0, 1))).toBe(RangeDirection.FORWARD);
  });

  it('should return BACKWARD for backward range', () => {
    expect(getRangeDirection(r(1, 0))).toBe(RangeDirection.BACKWARD);
  });

  it('should return FORWARD for collapsed range', () => {
    expect(getRangeDirection(r(2))).toBe(RangeDirection.FORWARD);
  });
});

describe('isRangeCollapsed', () => {
  it('should return true for collapsed range', () => {
    const range = r(2);
    expect(isRangeCollapsed(range)).toBe(true);
  });

  it('should return false for expanded forward range', () => {
    const range = r(2, 3);
    expect(isRangeCollapsed(range)).toBe(false);
  });

  it('should return false for expanded backward range', () => {
    const range = r(3, 2);
    expect(isRangeCollapsed(range)).toBe(false);
  });
});

describe('isInRange', () => {
  describe('forward range', () => {
    it('should return true for index in middle of range', () => {
      expect(isInRange(r(0, 2), 1)).toBe(true);
    });

    it('should return true for index at anchor of range', () => {
      expect(isInRange(r(0, 2), 0)).toBe(true);
    });

    it('should return true for index at focus of range', () => {
      expect(isInRange(r(0, 2), 2)).toBe(true);
    });

    it('should return false for index before range', () => {
      expect(isInRange(r(1, 2), 0)).toBe(false);
    });

    it('should return false for index after range', () => {
      expect(isInRange(r(1, 2), 3)).toBe(false);
    });

    it('should return false for index -1', () => {
      expect(isInRange(r(0, 2), -1)).toBe(false);
    });
  });

  describe('backward range', () => {
    it('should return true for index in middle of range', () => {
      expect(isInRange(r(2, 0), 1)).toBe(true);
    });

    it('should return true for index at anchor of range', () => {
      expect(isInRange(r(2, 0), 2)).toBe(true);
    });

    it('should return true for index at focus of range', () => {
      expect(isInRange(r(2, 0), 0)).toBe(true);
    });

    it('should return false for index before range', () => {
      expect(isInRange(r(2, 1), 0)).toBe(false);
    });

    it('should return false for index after range', () => {
      expect(isInRange(r(2, 1), 3)).toBe(false);
    });

    it('should return false for index -1', () => {
      expect(isInRange(r(2, 0), -1)).toBe(false);
    });
  });
});

describe('mergeTwoRanges', () => {
  it('should return null for non-overlapping non-adjacent ranges', () => {
    const rangeA = r(0, 1);
    const rangeB = r(3, 4);
    const merged = mergeTwoRanges(rangeA, rangeB);
    expect(merged).toBeNull();
  });

  it('should merge two overlapping ranges', () => {
    const rangeA = r(0, 2);
    const rangeB = r(1, 3);
    const merged = mergeTwoRanges(rangeA, rangeB);
    expect(merged).toEqual(r(0, 3));
  });

  it('should merge two adjacent ranges', () => {
    const rangeA = r(0, 1);
    const rangeB = r(2, 3);
    const merged = mergeTwoRanges(rangeA, rangeB);
    expect(merged).toEqual(r(0, 3));
  });

  it('should merge two adjacent backward ranges', () => {
    const rangeA = r(3, 2);
    const rangeB = r(1, 0);
    const merged = mergeTwoRanges(rangeA, rangeB);
    expect(merged).toEqual(r(3, 0));
  });

  it('should merge two adjacent collapsed ranges', () => {
    const rangeA = r(0);
    const rangeB = r(1);
    const merged = mergeTwoRanges(rangeA, rangeB);
    expect(merged).toEqual(r(0, 1));
  });

  it('should merge two ranges with one collapsed range', () => {
    const rangeA = r(0, 2);
    const rangeB = r(1);
    const merged = mergeTwoRanges(rangeA, rangeB);
    expect(merged).toEqual(r(0, 2));
  });

  it('should merge adjacent forward and backward range into forward range', () => {
    const forward = r(0, 2);
    const backward = r(5, 3);
    const merged = mergeTwoRanges(forward, backward);
    expect(merged).toEqual(r(0, 5));
  });

  it('should merge adjacent backward and forward range into backward range', () => {
    const forward = r(0, 2);
    const backward = r(5, 3);
    const merged = mergeTwoRanges(backward, forward);
    expect(merged).toEqual(r(5, 0));
  });
});

describe('mergeRanges', () => {
  it('should handle empty input', () => {
    const merged = mergeRanges([]);
    expect(merged).toEqual([]);
  });

  it('should handle single range input', () => {
    const ranges = [r(0, 1)];
    const merged = mergeRanges(ranges);
    expect(merged).toEqual(ranges);
  });

  it('should merge two overlapping ranges', () => {
    const ranges = [r(0, 2), r(1, 3)];
    const merged = mergeRanges(ranges);
    expect(merged).toEqual([r(0, 3)]);
  });

  it('should merge subset range into superset range', () => {
    const superset = r(0, 3);
    const subset = r(1, 2);
    const merged = mergeRanges([superset, subset]);
    expect(merged).toEqual([superset]);
  });

  it('should merge adjacent non-overlapping ranges', () => {
    const ranges = [r(0, 1), r(2, 3)];
    const merged = mergeRanges(ranges);
    expect(merged).toEqual([r(0, 3)]);
  });

  it('should merge multiple overlapping ranges', () => {
    const ranges = [r(0, 2), r(1, 3), r(4, 5)];
    const merged = mergeRanges(ranges);
    expect(merged).toEqual([r(0, 5)]);
  });

  it('should merge multiple adjacent non-overlapping ranges', () => {
    const ranges = [r(0, 1), r(2, 3), r(4, 5)];
    const merged = mergeRanges(ranges);
    expect(merged).toEqual([r(0, 5)]);
  });

  it('should merge multiple adjacent backward non-overlapping ranges', () => {
    const ranges = [r(1, 0), r(3, 2), r(5, 4)];
    const merged = mergeRanges(ranges);
    expect(merged).toEqual([r(5, 0)]);
  });

  it('should merge multiple adjacent collapsed non-overlapping ranges', () => {
    const ranges = [r(0), r(1), r(2)];
    const merged = mergeRanges(ranges);
    expect(merged).toEqual([r(0, 2)]);
  });

  it('should merge mixed range types', () => {
    const collapsedRange = r(0);
    const forwardRange = r(1, 3);
    const backwardRange = r(4, 2);
    const adjacentRange = r(5, 6);
    const nonAdjacentRange = r(8, 8);
    const overlappingRange = r(3, 5);
    const merged = mergeRanges([
      collapsedRange,
      forwardRange,
      backwardRange,
      adjacentRange,
      nonAdjacentRange,
      overlappingRange,
    ]);
    expect(merged).toEqual([r(8), r(0, 6)]);
  });

  it('should merge out-of-order ranges', () => {
    const ranges = [r(13), r(15, 19), r(14), r(11, 12)]; // 13, 15=>19, 14, 11=>12
    const merged = mergeRanges(ranges);
    expect(merged).toEqual([r(11, 19)]); // 11=>19
  });

  it('should not merge non-adjacent non-overlapping ranges', () => {
    const collapsedRange = r(0);
    const forwardRange = r(3, 4);
    const backwardRange = r(7, 6);
    const merged = mergeRanges([collapsedRange, forwardRange, backwardRange]);
    expect(merged).toEqual([collapsedRange, forwardRange, backwardRange]);
  });
});

describe('removeIndexFromRange', () => {
  it('should remove index from range and split range', () => {
    const range = r(0, 2); // 0=>2
    const result = removeIndexFromRange(range, 1); // Remove 1
    expect(result).toEqual([r(0), r(2)]); // 0, 2
  });

  it('should remove index from end of range', () => {
    const range = r(0, 2); // 0=>2
    const result = removeIndexFromRange(range, 2); // Remove 2
    expect(result).toEqual([r(0, 1)]); // 0=>1
  });

  it('should remove index from backawards range', () => {
    const range = r(2, 0); // 2=>0
    const result = removeIndexFromRange(range, 1); // Remove 1
    expect(result).toEqual([r(0), r(2)]); // 0=>2
  });

  it('should return empty array if range is collapsed and index is equal to anchor', () => {
    const range = r(1); // 1
    const result = removeIndexFromRange(range, 1); // Remove 1
    expect(result).toEqual([]);
  });

  it('should return original range if index is outside the range', () => {
    const range = r(0, 2); // 0=>2
    const result = removeIndexFromRange(range, 3); // Remove 3
    expect(result).toEqual([range]); // 0=>2
  });
});

describe('removeIndexFromRanges', () => {
  it('should remove index from multiple ranges', () => {
    const ranges = [r(0, 2), r(4, 6)]; // 0=>2 + 4=>6
    const result = removeIndexFromRanges(ranges, 1); // Remove 1
    expect(result).toEqual([r(0), r(2), r(4, 6)]); // 0 + 2 + 4=>6
  });
});

describe('insertIndexIntoRange', () => {
  it('should split range at index', () => {
    const range = r(0, 4); // 0=>4
    const result = insertIndexIntoRange(range, 2); // Insert at 2
    expect(result).toEqual([r(0, 1), r(3, 5)]); // 0=>1 + 3=>5
  });

  it('should move collapsed range to after index', () => {
    const range = r(2); // 2
    const result = insertIndexIntoRange(range, 2); // Insert at 2
    expect(result).toEqual([r(3)]); // 3
  });
});

describe('rangeToIndexes', () => {
  it('should return a single index for a collapsed range', () => {
    const range = r(2);
    const indexes = rangeToIndexes(range);
    expect(indexes).toEqual([2]);
  });

  it('should return a range of indexes for a forward range', () => {
    const range = r(1, 3);
    const indexes = rangeToIndexes(range);
    expect(indexes).toEqual([1, 2, 3]);
  });

  it('should return a range of indexes for a backward range', () => {
    const range = r(3, 1);
    const indexes = rangeToIndexes(range);
    expect(indexes).toEqual([1, 2, 3]);
  });
});

describe('rangesToIndexes', () => {
  it('should return an empty array for empty ranges', () => {
    const ranges: SelectionRange[] = [];
    const indexes = rangesToIndexes(ranges);
    expect(indexes).toEqual([]);
  });
  it('should return a single index for a single collapsed range', () => {
    const ranges = [r(2)];
    const indexes = rangesToIndexes(ranges);
    expect(indexes).toEqual([2]);
  });
  it('should return a range of indexes for a single forward range', () => {
    const ranges = [r(1, 3)];
    const indexes = rangesToIndexes(ranges);
    expect(indexes).toEqual([1, 2, 3]);
  });
  it('should return a range of indexes for a single backward range', () => {
    const ranges = [r(3, 1)];
    const indexes = rangesToIndexes(ranges);
    expect(indexes).toEqual([1, 2, 3]);
  });
  it('should return a merged range of indexes for multiple ranges', () => {
    const ranges = [r(0, 2), r(4, 6)]; // 0=>2 + 4=>6
    const indexes = rangesToIndexes(ranges);
    expect(indexes).toEqual([0, 1, 2, 4, 5, 6]);
  });
});

describe('indexesToRanges', () => {
  it('should return a single range for a single index', () => {
    const indexes = [2];
    const ranges = indexesToRanges(indexes);
    expect(ranges).toEqual([r(2)]);
  });

  it('should return a single range for consecutive indexes', () => {
    const indexes = [1, 2, 3];
    const ranges = indexesToRanges(indexes);
    expect(ranges).toEqual([r(1, 3)]);
  });

  it('should return multiple ranges for non-consecutive indexes', () => {
    const indexes = [0, 1, 3, 4, 6, 7];
    const ranges = indexesToRanges(indexes);
    expect(ranges).toEqual([r(0, 1), r(3, 4), r(6, 7)]);
  });

  it('should return a collapsed range for non-consecutive indexes', () => {
    const indexes = [0, 1, 3];
    const ranges = indexesToRanges(indexes);
    expect(ranges).toEqual([r(0, 1), r(3)]);
  });
});

const r = (anchor: number, focus = anchor): SelectionRange => ({ anchor, focus });
