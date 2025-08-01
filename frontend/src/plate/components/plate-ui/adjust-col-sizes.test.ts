import { describe, expect, it } from 'bun:test';
import { adjustColSizes } from '@app/plate/toolbar/table/table';

const MAX_WIDTH = 10;

describe.only('adjustColSizes', () => {
  describe('with adding column to the right', () => {
    const before = false;

    describe('with no need to resize existing columns', () => {
      it('should copy column size from the left instead of having auto size (0)', () => {
        expect(adjustColSizes([1, 0, 3], 0, before, MAX_WIDTH)).toEqual([1, 1, 3]);
        expect(adjustColSizes([2, 2, 0], 1, before, MAX_WIDTH)).toEqual([2, 2, 2]);
      });
    });

    describe('with no extra room', () => {
      it('should use half the size of the left column, and also shrink the left column to half its original size', () => {
        expect(adjustColSizes([2, 8, 0], 1, before, MAX_WIDTH)).toEqual([2, 4, 4]);
        expect(adjustColSizes([2, 0, 8], 0, before, MAX_WIDTH)).toEqual([1, 1, 8]);

        expect(adjustColSizes([1, 8, 0, 1], 1, before, MAX_WIDTH)).toEqual([1, 4, 4, 1]);
        expect(adjustColSizes([2, 2, 8, 0], 2, before, MAX_WIDTH)).toEqual([2, 2, 3, 3]);
        expect(adjustColSizes([6, 0, 2, 2], 0, before, MAX_WIDTH)).toEqual([3, 3, 2, 2]);
      });
    });

    describe('with some extra room', () => {
      it('it should use the extra room + original size from left column and distribute it evenly with the new column', () => {
        expect(adjustColSizes([2, 6, 0], 1, before, MAX_WIDTH)).toEqual([2, 4, 4]);
        expect(adjustColSizes([6, 0, 2], 0, before, MAX_WIDTH)).toEqual([4, 4, 2]);
      });
    });

    describe('where original columns are spaced evenly', () => {
      it('should add new column with same size if there is room', () => {
        expect(adjustColSizes([2, 0, 2, 2], 0, before, MAX_WIDTH)).toEqual([2, 2, 2, 2]);
        expect(adjustColSizes([2, 2, 0, 2], 1, before, MAX_WIDTH)).toEqual([2, 2, 2, 2]);
        expect(adjustColSizes([2, 2, 2, 0], 2, before, MAX_WIDTH)).toEqual([2, 2, 2, 2]);
      });

      it('should scale down original columns if there is no room to reuse col size for the column', () => {
        expect(adjustColSizes([4, 0, 4, 4], 0, before, 12)).toEqual([3, 3, 3, 3]);
        expect(adjustColSizes([4, 4, 0, 4], 1, before, 12)).toEqual([3, 3, 3, 3]);
        expect(adjustColSizes([4, 4, 4, 0], 2, before, 12)).toEqual([3, 3, 3, 3]);
      });
    });
  });

  describe('with adding column to the left', () => {
    const before = true;

    describe('with no need to resize existing columns', () => {
      it('should copy column size from the right instead of having auto size (0)', () => {
        expect(adjustColSizes([0, 1, 3], 0, before, MAX_WIDTH)).toEqual([1, 1, 3]);
        expect(adjustColSizes([2, 0, 2], 1, before, MAX_WIDTH)).toEqual([2, 2, 2]);
      });
    });

    describe('with no extra room', () => {
      it('should use half the size of the right column, and also shrink the right column to half its original size', () => {
        expect(adjustColSizes([2, 0, 8], 1, before, MAX_WIDTH)).toEqual([2, 4, 4]);
        expect(adjustColSizes([0, 2, 8], 0, before, MAX_WIDTH)).toEqual([1, 1, 8]);

        expect(adjustColSizes([1, 0, 8, 1], 1, before, MAX_WIDTH)).toEqual([1, 4, 4, 1]);
        expect(adjustColSizes([2, 2, 0, 8], 2, before, MAX_WIDTH)).toEqual([2, 2, 3, 3]);
        expect(adjustColSizes([0, 6, 2, 2], 0, before, MAX_WIDTH)).toEqual([3, 3, 2, 2]);
      });
    });

    describe('with some extra room', () => {
      it('it should use the extra room + original size from right column and distribute it evenly with the new column', () => {
        expect(adjustColSizes([2, 0, 6], 1, before, MAX_WIDTH)).toEqual([2, 4, 4]);
        expect(adjustColSizes([0, 6, 2], 0, before, MAX_WIDTH)).toEqual([4, 4, 2]);
      });
    });

    describe('where original columns are spaced evenly', () => {
      it('should add new column with same size if there is room', () => {
        expect(adjustColSizes([0, 2, 2, 2], 0, before, MAX_WIDTH)).toEqual([2, 2, 2, 2]);
        expect(adjustColSizes([2, 0, 2, 2], 1, before, MAX_WIDTH)).toEqual([2, 2, 2, 2]);
        expect(adjustColSizes([2, 2, 0, 2], 2, before, MAX_WIDTH)).toEqual([2, 2, 2, 2]);
      });

      it('should scale down original columns if there is no room to reuse col size for the column', () => {
        expect(adjustColSizes([0, 4, 4, 4], 0, before, 12)).toEqual([3, 3, 3, 3]);
        expect(adjustColSizes([4, 0, 4, 4], 1, before, 12)).toEqual([3, 3, 3, 3]);
        expect(adjustColSizes([4, 4, 0, 4], 2, before, 12)).toEqual([3, 3, 3, 3]);
      });
    });
  });
});
