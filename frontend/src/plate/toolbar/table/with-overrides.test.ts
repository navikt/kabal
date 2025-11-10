import { describe, expect, test } from 'bun:test';
import { getAdjustedSpans } from '@app/plate/toolbar/table/with-overrides';

describe('getAdjustedSpans', () => {
  test('nothing to adjust', () => {
    expect(getAdjustedSpans([1, 1, 1], 3)).toEqual([1, 1, 1]);
    expect(getAdjustedSpans([2, 2, 2], 6)).toEqual([2, 2, 2]);
  });

  test('return only 1s if number of cols is same as maxCols', () => {
    expect(getAdjustedSpans([1, 2, 30], 3)).toEqual([1, 1, 1]);
    expect(getAdjustedSpans([1, 2, 3], 3)).toEqual([1, 1, 1]);
  });

  test('shrink only possible column', () => {
    expect(getAdjustedSpans([1, 2, 1], 3)).toEqual([1, 1, 1]);
    expect(getAdjustedSpans([2, 1, 1], 3)).toEqual([1, 1, 1]);
    expect(getAdjustedSpans([1, 1, 2], 3)).toEqual([1, 1, 1]);
    expect(getAdjustedSpans([1, 1, 200], 3)).toEqual([1, 1, 1]);
  });

  test("enlarge last column if the row doesn't fill entire width", () => {
    expect(getAdjustedSpans([1, 1, 1], 4)).toEqual([1, 1, 2]);
    expect(getAdjustedSpans([1, 1, 1], 6)).toEqual([1, 1, 4]);
    expect(getAdjustedSpans([1, 3, 3], 4)).toEqual([1, 1, 2]);
  });

  test('shrink proportionally', () => {
    expect(getAdjustedSpans([1, 4, 6], 6)).toEqual([1, 2, 3]);
    expect(getAdjustedSpans([1, 2, 3], 4)).toEqual([1, 1, 2]);
  });

  test('never shrink below 1 - even for impossible cases', () => {
    expect(getAdjustedSpans([1, 1, 1], 1)).toEqual([1, 1, 1]);
  });
});
