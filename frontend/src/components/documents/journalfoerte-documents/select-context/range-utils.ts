export type Path = [number, number];

export interface MutableSelectionRange {
  anchor: number;
  focus: number;
}

export interface SelectionRange {
  readonly anchor: number;
  readonly focus: number;
}

const createRange = (anchor: number, focus = anchor): SelectionRange => ({ anchor, focus });

export enum RangeDirection {
  FORWARD = 0,
  BACKWARD = 1,
}

// If the anchor index is greater than the focus index, the selection is backwards.
export const getRangeDirection = (range: SelectionRange): RangeDirection =>
  range.anchor <= range.focus ? RangeDirection.FORWARD : RangeDirection.BACKWARD;

export const isRangeBackward = (range: SelectionRange) => getRangeDirection(range) === RangeDirection.BACKWARD;

export const isRangeCollapsed = ({ anchor, focus }: SelectionRange) => anchor === focus;

/**
 * Checks if the given index is within the range.
 * @example `0..4` and `2` is in range
 * @example `0..4` and `5` is not in range
 * @param range
 * @param accessibleIndex
 * @returns - True if the index is in range, false otherwise.
 */
export const isInRange = (range: SelectionRange, accessibleIndex: number) => {
  const [start, end] = getRangeStartAndEnd(range);
  return accessibleIndex >= start && accessibleIndex <= end;
};
/**
 * Checks if the given index is within any of the ranges.
 * @example Check if `2` is in any of the ranges [`0..2`, `3..4`] === `true`.
 * @example Check if `5` is in any of the ranges [`0..2`, `3..4`] === `false`.
 * @param ranges
 * @param accessibleIndex
 * @returns - True if the index is in any range, false otherwise.
 */
export const isInRanges = (ranges: Readonly<SelectionRange[]>, accessibleIndex: number) =>
  ranges.some((range) => isInRange(range, accessibleIndex));

/**
 * Checks if two ranges are equal and same direction.
 * @example `0..4` and `0..4` are equal
 * @example `0..4` and `4..0` are not equal
 * @example `0..4` and `0..3` are not equal
 * @returns - True if the ranges are equal, false otherwise.
 */
const areRangesEqual = (rangeA: SelectionRange, rangeB: SelectionRange) =>
  rangeA.anchor === rangeB.anchor && rangeA.focus === rangeB.focus;

export const getRange = (ranges: Readonly<SelectionRange[]>, accessibleIndex: number): SelectionRange | undefined =>
  ranges.find((range) => isInRange(range, accessibleIndex));

export const getRangeStart = ({ anchor, focus }: SelectionRange): number => Math.min(anchor, focus);
export const getRangeEnd = ({ anchor, focus }: SelectionRange): number => Math.max(anchor, focus);
export const getRangeStartAndEnd = (range: SelectionRange): [number, number] => [
  getRangeStart(range),
  getRangeEnd(range),
];

/**
 * Inserts a space into a range at the given index. Splitting the range and preserving the total length of the range.
 * @example `0..4` split on `2` becomes `0..1` and `3..5`
 * @param range - The range to insert into.
 * @param index - The index to insert at.
 * @returns - An array of one or two ranges, neither including the index.
 */
export const insertIndexIntoRange = (range: SelectionRange, index: number): SelectionRange[] => {
  const [start, end] = getRangeStartAndEnd(range);

  // If the index is outside the range, return the original range.
  if (index < start || index > end) {
    return [range];
  }

  // If the range is collapsed, return a new collapsed range after the index.
  if (isRangeCollapsed(range)) {
    return [createRange(index + 1, index + 1)];
  }

  // Otherwise, split the range into two ranges.
  return [createRange(start, index - 1), createRange(index + 1, end + 1)];
};
/**
 * Merges two ranges into one if they are adjacent or overlapping.
 * `rangeA` will determine the direction of the merged range.
 * @param rangeA
 * @param rangeB
 * @returns - The merged range or null if the ranges could not be merged.
 */
export const mergeTwoRanges = (rangeA: SelectionRange, rangeB: SelectionRange): SelectionRange | null => {
  if (areRangesEqual(rangeA, rangeB)) {
    return rangeA;
  }

  const isBackward = isRangeBackward(rangeA);

  const [startA, endA] = getRangeStartAndEnd(rangeA);
  const [startB, endB] = getRangeStartAndEnd(rangeB);

  // If the ranges are not adjacent or overlapping, return null.
  if (startA > endB + 1 || startB > endA + 1) {
    return null;
  }

  if (isBackward) {
    // If the first range is backward, we need to merge it into a backward range.
    return createRange(Math.max(endA, endB), Math.min(startA, startB));
  }

  // If the first range is forward, we need to merge it into a forward range.
  return createRange(Math.min(startA, startB), Math.max(endA, endB));
};

const _mergeRanges = (reversedRanges: SelectionRange[]): SelectionRange[] => {
  const beforeCount = reversedRanges.length;
  const [lastRange, ...rest] = reversedRanges;

  if (lastRange === undefined) {
    return reversedRanges;
  }

  const mergedRanges: SelectionRange[] = [lastRange];

  for (const range of rest) {
    let merged = false;
    const lastIndex = mergedRanges.length - 1;

    for (let i = 0; i <= lastIndex; i++) {
      const mergedRange = mergedRanges[i];

      if (mergedRange === undefined) {
        continue;
      }

      const mergeResult = mergeTwoRanges(mergedRange, range);

      if (mergeResult !== null) {
        mergedRanges[i] = mergeResult; // Update the merged range in place.
        merged = true;
        break;
      }
    }

    if (!merged) {
      mergedRanges.push(range);
    }
  }

  const afterCount = mergedRanges.length;

  if (afterCount > beforeCount) {
    throw new Error(`Merged ranges increased in size: ${beforeCount} => ${afterCount}`);
  }

  if (afterCount === 0) {
    throw new Error('No ranges left after merging');
  }

  // If there are just as many ranges after merging as before, there is nothing more merge.
  if (afterCount === beforeCount) {
    return mergedRanges;
  }

  return _mergeRanges(mergedRanges);
};

/**
 * Merges all adjacent or overlapping ranges.
 * @example `0..4` and `3..7` becomes `0..7`
 * @example `0..4` and `5..7` becomes `0..7`
 * @param ranges - The ranges to merge.
 * @returns - The merged ranges.
 */
export const mergeRanges = (ranges: readonly SelectionRange[]): readonly SelectionRange[] => {
  const mergedRanges = _mergeRanges(ranges.toReversed()).toReversed();

  return Object.freeze(mergedRanges);
};

/**
 * Removes the given index from the range.
 * @example `0..4` with index `2` becomes `0..1`, `3..4`
 * @param range - The range to remove the index from.
 * @param index - The index to remove from the range.
 * @returns - The updated range after removing the index.
 */
export const removeIndexFromRange = (range: SelectionRange, index: number): SelectionRange[] => {
  if (isRangeCollapsed(range)) {
    if (isInRange(range, index)) {
      return [];
    }

    return [range];
  }

  const [start, end] = getRangeStartAndEnd(range);

  // If the index is outside the range, return the original range.
  if (index < start || index > end) {
    return [range];
  }

  if (index === start) {
    return [createRange(start + 1, end)];
  }

  if (index === end) {
    return [createRange(start, end - 1)];
  }

  return [createRange(start, index - 1), createRange(index + 1, end)];
};

/**
 * Removes the given index from all ranges. Leaving a gap in the ranges.
 * @example `0..4` and `7..7` with index `2` becomes `0..1`, `3..4`, and `7..7`
 * @param ranges - The ranges to remove the index from.
 * @param index - The index to remove from the ranges.
 * @returns - The updated ranges after removing the index.
 */
export const removeIndexFromRanges = (ranges: Readonly<SelectionRange[]>, index: number): SelectionRange[] => {
  const newRanges: SelectionRange[] = [];

  for (const range of ranges) {
    const newRange = removeIndexFromRange(range, index);

    if (newRange.length > 0) {
      newRanges.push(...newRange);
    }
  }

  return newRanges;
};

/**
 * Converts a range to a sorted array of all the individual unique indexes.
 * @example `0..4` becomes `0, 1, 2, 3, 4`
 * @param range - The range to convert.
 * @returns - All indexes in the range.
 */
export const rangeToIndexes = (range: SelectionRange) => {
  const indexes: Set<number> = new Set();
  const start = getRangeStart(range);
  const end = getRangeEnd(range);

  for (let i = start; i <= end; i++) {
    indexes.add(i);
  }

  return Object.freeze(Array.from(indexes).toSorted((a, b) => a - b));
};

/**
 * Converts an array of ranges to a sorted array of all the individual unique indexes.
 * @example `0..4` and `7..7` becomes `0, 1, 2, 3, 4, 7`
 * @param ranges - The ranges to convert.
 * @returns - All indexes in the ranges.
 */
export const rangesToIndexes = (ranges: readonly SelectionRange[]): readonly number[] => {
  const indexes: Set<number> = new Set();

  for (const range of ranges) {
    for (const index of rangeToIndexes(range)) {
      indexes.add(index);
    }
  }

  return Object.freeze(Array.from(indexes).toSorted((a, b) => a - b));
};

/**
 * Converts an array of indexes to a sorted array of ranges.
 * @example `0, 1, 2, 3, 4, 7` becomes `0..4` and `7..7`
 * @param indexes - The indexes to convert to ranges.
 * @returns - All ranges covering the indexes.
 */
export const indexesToRanges = (indexes: Readonly<number[]>): Readonly<SelectionRange[]> => {
  const [first, ...rest] = indexes.toSorted((a, b) => a - b);

  if (first === undefined) {
    return [];
  }

  let lastRange: MutableSelectionRange = { anchor: first, focus: first };
  const ranges: SelectionRange[] = [lastRange];

  for (const index of rest) {
    if (index === lastRange.focus + 1) {
      lastRange.focus = index;
    } else {
      lastRange = { anchor: index, focus: index };
      ranges.push(lastRange);
    }
  }

  return ranges;
};
