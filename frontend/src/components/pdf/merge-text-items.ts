import type { TextItem, TextMarkedContent } from 'pdfjs-dist/types/src/display/api';

const Y_TOLERANCE = 0.1;

const getX = (item: TextItem): number => item.transform[4];
const getY = (item: TextItem): number => item.transform[5];
const getEndX = (item: TextItem): number => getX(item) + item.width;

/**
 * Merges horizontally adjacent PDF text items on the same line.
 * This improves text selection in the browser by combining fragmented text.
 */
export const mergeTextItems = (items: (TextItem | TextMarkedContent)[]): TextItem[] => {
  if (items.length === 0) {
    return [];
  }

  // Group items by their y-position (line)
  const lineGroups = new Map<number, TextItem[]>();

  for (const item of items) {
    if ('id' in item) {
      // Skip marked content items
      continue;
    }

    if (item.width === 0) {
      // Skip zero-width items
      continue;
    }

    const y = getY(item);
    let foundGroup = false;

    // Find an existing group with a close y-position
    for (const [groupY, group] of lineGroups) {
      if (Math.abs(y - groupY) <= Y_TOLERANCE) {
        group.push(item);
        foundGroup = true;
        break;
      }
    }

    if (!foundGroup) {
      lineGroups.set(y, [item]);
    }
  }

  const result: TextItem[] = [];

  // Process each line group
  for (const [, group] of lineGroups) {
    // Sort by x-position
    const sorted = [...group].sort((a, b) => getX(a) - getX(b));

    // Merge adjacent items
    const mergedLine = mergeAdjacentItems(sorted);
    result.push(...mergedLine);
  }

  // Sort result by y-position (descending, as PDF coordinates start from bottom)
  // then by x-position
  result.sort((a, b) => {
    const yDiff = getY(b) - getY(a);

    if (Math.abs(yDiff) > Y_TOLERANCE) {
      return yDiff;
    }

    return getX(a) - getX(b);
  });

  return result;
};

const mergeAdjacentItems = (sortedItems: TextItem[]): TextItem[] => {
  if (sortedItems.length === 0) {
    return [];
  }

  const first = sortedItems[0];

  if (first === undefined) {
    return [];
  }

  const result: TextItem[] = [];
  let current = { ...first };

  for (let i = 1; i < sortedItems.length; i++) {
    const next = sortedItems[i];

    if (next === undefined) {
      continue;
    }

    const gap = getX(next) - getEndX(current);
    // Use font height as basis for gap threshold - allow gaps up to half the font height
    const maxGap = Math.max(current.height, next.height) / 2;

    const shouldMerge =
      gap <= maxGap &&
      current.fontName === next.fontName &&
      current.dir === next.dir &&
      Math.abs(current.height - next.height) < Y_TOLERANCE;

    if (shouldMerge) {
      // Merge next into current
      current = {
        ...current,
        str: current.str + next.str,
        width: getX(next) + next.width - getX(current),
        hasEOL: next.hasEOL,
      };
    } else {
      result.push(current);
      current = { ...next };
    }
  }

  result.push(current);

  return result;
};
