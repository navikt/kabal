import { ElementApi, type Path, PathApi, type Point, type TElement, TextApi, type TRange } from 'platejs';

const UNICODE_SPACE_SEQUENCE = /\p{Zs}{2,}/gu;
const LEADING_WHITESPACE = /^\p{Zs}+/u;
const TRAILING_WHITESPACE = /\p{Zs}{2,}$/u;
const ENDS_WITH_UNICODE_SPACE = /\p{Zs}$/u;
const ALL_TRAILING_WHITESPACE = /\p{Zs}+$/u;
/** Match spaces before punctuation. */
const SPACE_BEFORE_PUNCTUATION = /\p{Zs}+(?=[.,:;!?)\u2026])/gu;
/** Match spaces immediately after a forced newline (`\n`). */
const LEADING_SPACE_AFTER_NEWLINE = /\n\p{Zs}+/gu;
/** Match spaces immediately before a forced newline (`\n`). */
const TRAILING_SPACE_BEFORE_NEWLINE = /\p{Zs}{2,}\n/gu;

export enum WhitespaceIssueType {
  DoubleSpace = 0,
  LeadingWhitespace = 1,
  TrailingWhitespace = 2,
  SpaceBeforePunctuation = 3,
}

export interface WhitespaceIssue {
  type: WhitespaceIssueType;
  /** Start of the decoration (wavy underline) range. */
  anchor: Point;
  /** End of the decoration range. */
  focus: Point;
  /** Ranges to delete when cleaning up this issue. */
  deleteRanges: TRange[];
}

export interface FindWhitespaceIssuesOptions {
  /** When true, leading whitespace is collapsed to one space instead of fully removed. */
  collapseLeading?: boolean;
  /** When true, even a single trailing space is flagged as TrailingWhitespace. */
  strictTrailing?: boolean;
}

/** Find whitespace issues in an element: double spaces, leading/trailing whitespace, and spaces before punctuation. */
export const findWhitespaceIssues = (
  element: TElement,
  elementPath: Path,
  options?: FindWhitespaceIssuesOptions,
): WhitespaceIssue[] => {
  const runs = getConsecutiveTextRuns(element);

  if (runs.length === 0) {
    return [];
  }

  const firstChild = runs.at(0)?.at(0);
  const lastChild = runs.at(-1)?.at(-1);
  const isFirstRunAtStart = firstChild !== undefined && firstChild.childIndex === 0;
  const isLastRunAtEnd = lastChild !== undefined && lastChild.childIndex === element.children.length - 1;

  return runs.flatMap((run, i) => {
    const firstInRun = run[0];
    const lastInRun = run[run.length - 1];

    if (firstInRun === undefined || lastInRun === undefined) {
      return [];
    }

    const prevSiblingIndex = firstInRun.childIndex - 1;
    const prevSibling = element.children[prevSiblingIndex];

    let inlineTrailingSpaceRange: TRange | undefined;

    if (prevSibling !== undefined && ElementApi.isElement(prevSibling)) {
      inlineTrailingSpaceRange = findTrailingSpaceRange(prevSibling, [...elementPath, prevSiblingIndex]);
    }

    const nextSiblingIndex = lastInRun.childIndex + 1;
    const nextSibling = element.children[nextSiblingIndex];

    let inlineLeadingSpaceRange: TRange | undefined;

    if (nextSibling !== undefined && ElementApi.isElement(nextSibling)) {
      inlineLeadingSpaceRange = findLeadingSpaceRange(nextSibling, [...elementPath, nextSiblingIndex]);
    }

    return findIssuesInRun(
      run,
      elementPath,
      i === 0 && isFirstRunAtStart && options?.collapseLeading !== true,
      i === runs.length - 1 && isLastRunAtEnd,
      inlineTrailingSpaceRange,
      inlineLeadingSpaceRange,
      options?.strictTrailing === true,
    );
  });
};

const findIssuesInRun = (
  run: TextChild[],
  elementPath: Path,
  checkLeading: boolean,
  checkTrailing: boolean,
  inlineTrailingSpaceRange: TRange | undefined,
  inlineLeadingSpaceRange: TRange | undefined,
  strictTrailing: boolean,
): WhitespaceIssue[] => {
  const combinedText = run.map(({ text }) => text).join('');
  const segments = buildSegments(run);

  /** Ranges covered by more specific issues, used to skip overlapping double-space matches. */
  const coveredRanges: { start: number; end: number }[] = [];
  const issues: WhitespaceIssue[] = [];

  if (checkLeading) {
    findLeadingIssues(combinedText, segments, elementPath, issues, coveredRanges);
  }

  if (checkTrailing) {
    findTrailingIssues(combinedText, segments, elementPath, strictTrailing, issues, coveredRanges);
  }

  findLeadingAfterNewlineIssues(combinedText, segments, elementPath, issues, coveredRanges);
  findTrailingBeforeNewlineIssues(combinedText, segments, elementPath, issues, coveredRanges);
  findCrossBoundaryForwardIssues(combinedText, segments, elementPath, inlineTrailingSpaceRange, issues, coveredRanges);
  findCrossBoundaryReverseIssues(combinedText, segments, elementPath, inlineLeadingSpaceRange, issues, coveredRanges);
  findSpaceBeforePunctuationIssues(combinedText, segments, elementPath, issues, coveredRanges);
  findDoubleSpaceIssues(combinedText, segments, elementPath, coveredRanges, issues);

  return issues;
};

type CoveredRange = { start: number; end: number };

interface TextChild {
  childIndex: number;
  text: string;
}
interface TextSegment {
  childIndex: number;
  start: number;
  length: number;
}

const findLeadingIssues = (
  text: string,
  segments: TextSegment[],
  elementPath: Path,
  issues: WhitespaceIssue[],
  coveredRanges: CoveredRange[],
): void => {
  const match = text.match(LEADING_WHITESPACE);

  if (match === null) {
    return;
  }

  const anchor = toPoint(segments, 0, elementPath);
  const focus = toPoint(segments, match[0].length, elementPath);

  coveredRanges.push({ start: 0, end: match[0].length });
  issues.push({ type: WhitespaceIssueType.LeadingWhitespace, anchor, focus, deleteRanges: [{ anchor, focus }] });
};

const findTrailingIssues = (
  text: string,
  segments: TextSegment[],
  elementPath: Path,
  strictTrailing: boolean,
  issues: WhitespaceIssue[],
  coveredRanges: CoveredRange[],
): void => {
  const match = text.match(strictTrailing ? ALL_TRAILING_WHITESPACE : TRAILING_WHITESPACE);

  if (match === null || match.index === undefined) {
    return;
  }

  const anchor = toPoint(segments, match.index, elementPath);
  const focus = toPoint(segments, match.index + match[0].length, elementPath);

  coveredRanges.push({ start: match.index, end: match.index + match[0].length });
  issues.push({ type: WhitespaceIssueType.TrailingWhitespace, anchor, focus, deleteRanges: [{ anchor, focus }] });
};

const findLeadingAfterNewlineIssues = (
  text: string,
  segments: TextSegment[],
  elementPath: Path,
  issues: WhitespaceIssue[],
  coveredRanges: CoveredRange[],
): void => {
  for (const match of text.matchAll(LEADING_SPACE_AFTER_NEWLINE)) {
    if (match.index === undefined) {
      continue;
    }

    // Anchor after the `\n`, focus at end of spaces.
    const spaceStart = match.index + 1;
    const spaceEnd = match.index + match[0].length;
    const anchor = toPoint(segments, spaceStart, elementPath);
    const focus = toPoint(segments, spaceEnd, elementPath);

    coveredRanges.push({ start: spaceStart, end: spaceEnd });
    issues.push({ type: WhitespaceIssueType.LeadingWhitespace, anchor, focus, deleteRanges: [{ anchor, focus }] });
  }
};

const findTrailingBeforeNewlineIssues = (
  text: string,
  segments: TextSegment[],
  elementPath: Path,
  issues: WhitespaceIssue[],
  coveredRanges: CoveredRange[],
): void => {
  for (const match of text.matchAll(TRAILING_SPACE_BEFORE_NEWLINE)) {
    if (match.index === undefined) {
      continue;
    }

    // Anchor at start of spaces, focus before the `\n`.
    const anchor = toPoint(segments, match.index, elementPath);
    const focus = toPoint(segments, match.index + match[0].length - 1, elementPath);

    coveredRanges.push({ start: match.index, end: match.index + match[0].length - 1 });
    issues.push({ type: WhitespaceIssueType.TrailingWhitespace, anchor, focus, deleteRanges: [{ anchor, focus }] });
  }
};

/** Detect cross-boundary double space: inline element trailing space + text leading space. */
const findCrossBoundaryForwardIssues = (
  text: string,
  segments: TextSegment[],
  elementPath: Path,
  inlineTrailingSpaceRange: TRange | undefined,
  issues: WhitespaceIssue[],
  coveredRanges: CoveredRange[],
): void => {
  if (inlineTrailingSpaceRange === undefined) {
    return;
  }

  const match = text.match(LEADING_WHITESPACE);

  if (match === null) {
    return;
  }

  coveredRanges.push({ start: 0, end: match[0].length });

  const focus = toPoint(segments, match[0].length, elementPath);
  const deleteRanges: TRange[] = [inlineTrailingSpaceRange];

  // For 2+ outside spaces: keep one, delete the rest.
  if (match[0].length >= 2) {
    deleteRanges.push({ anchor: toPoint(segments, 1, elementPath), focus });
  }

  issues.push({ type: WhitespaceIssueType.DoubleSpace, anchor: inlineTrailingSpaceRange.anchor, focus, deleteRanges });
};

/** Detect cross-boundary double space: text trailing space + inline element leading space. */
const findCrossBoundaryReverseIssues = (
  text: string,
  segments: TextSegment[],
  elementPath: Path,
  inlineLeadingSpaceRange: TRange | undefined,
  issues: WhitespaceIssue[],
  coveredRanges: CoveredRange[],
): void => {
  if (inlineLeadingSpaceRange === undefined) {
    return;
  }

  const match = text.match(ALL_TRAILING_WHITESPACE);

  if (match === null || match.index === undefined) {
    return;
  }

  const trailingSpaceStart = match.index;
  const trailingSpaceEnd = trailingSpaceStart + match[0].length;

  coveredRanges.push({ start: trailingSpaceStart, end: trailingSpaceEnd });

  const deleteRanges: TRange[] = [inlineLeadingSpaceRange];

  // For 2+ outside spaces: delete extras from the start, keep the last one.
  if (match[0].length >= 2) {
    deleteRanges.push({
      anchor: toPoint(segments, trailingSpaceStart, elementPath),
      focus: toPoint(segments, trailingSpaceEnd - 1, elementPath),
    });
  }

  issues.push({
    type: WhitespaceIssueType.DoubleSpace,
    anchor: toPoint(segments, trailingSpaceStart, elementPath),
    focus: inlineLeadingSpaceRange.focus,
    deleteRanges,
  });
};

const findSpaceBeforePunctuationIssues = (
  text: string,
  segments: TextSegment[],
  elementPath: Path,
  issues: WhitespaceIssue[],
  coveredRanges: CoveredRange[],
): void => {
  for (const match of text.matchAll(SPACE_BEFORE_PUNCTUATION)) {
    if (match.index === undefined) {
      continue;
    }

    const anchor = toPoint(segments, match.index, elementPath);
    const focus = toPoint(segments, match.index + match[0].length, elementPath);

    coveredRanges.push({ start: match.index, end: match.index + match[0].length });
    issues.push({
      type: WhitespaceIssueType.SpaceBeforePunctuation,
      anchor,
      focus,
      deleteRanges: [{ anchor, focus }],
    });
  }
};

/** Find remaining double-space sequences not already covered by more specific issues. */
const findDoubleSpaceIssues = (
  text: string,
  segments: TextSegment[],
  elementPath: Path,
  coveredRanges: CoveredRange[],
  issues: WhitespaceIssue[],
): void => {
  for (const match of text.matchAll(UNICODE_SPACE_SEQUENCE)) {
    if (match.index === undefined) {
      continue;
    }

    const matchEnd = match.index + match[0].length;
    const isCovered = coveredRanges.some((r) => match.index >= r.start && matchEnd <= r.end);

    if (isCovered) {
      continue;
    }

    issues.push({
      type: WhitespaceIssueType.DoubleSpace,
      anchor: toPoint(segments, match.index, elementPath),
      focus: toPoint(segments, matchEnd, elementPath),
      deleteRanges: [
        { anchor: toPoint(segments, match.index + 1, elementPath), focus: toPoint(segments, matchEnd, elementPath) },
      ],
    });
  }
};

/** Find the range covering the trailing space in an element's deepest last text node. */
const findTrailingSpaceRange = (element: TElement, basePath: Path): TRange | undefined => {
  const lastChildIndex = element.children.length - 1;
  const lastChild = element.children[lastChildIndex];

  if (lastChild === undefined) {
    return undefined;
  }

  if (TextApi.isText(lastChild)) {
    if (!ENDS_WITH_UNICODE_SPACE.test(lastChild.text)) {
      return undefined;
    }

    const path = [...basePath, lastChildIndex];

    return { anchor: { path, offset: lastChild.text.length - 1 }, focus: { path, offset: lastChild.text.length } };
  }

  if (ElementApi.isElement(lastChild)) {
    return findTrailingSpaceRange(lastChild, [...basePath, lastChildIndex]);
  }

  return undefined;
};

/** Find the range covering the leading space in an element's deepest first text node. */
const findLeadingSpaceRange = (element: TElement, basePath: Path): TRange | undefined => {
  const firstChild = element.children[0];

  if (firstChild === undefined) {
    return undefined;
  }

  if (TextApi.isText(firstChild)) {
    const match = firstChild.text.match(LEADING_WHITESPACE);

    if (match === null) {
      return undefined;
    }

    const path = [...basePath, 0];

    return { anchor: { path, offset: 0 }, focus: { path, offset: match[0].length } };
  }

  if (ElementApi.isElement(firstChild)) {
    return findLeadingSpaceRange(firstChild, [...basePath, 0]);
  }

  return undefined;
};

/** Group consecutive text children into runs, split by inline elements. */
const getConsecutiveTextRuns = (element: TElement): TextChild[][] => {
  const runs: TextChild[][] = [];
  let currentRun: TextChild[] = [];

  for (const [index, child] of element.children.entries()) {
    if (TextApi.isText(child)) {
      currentRun.push({ childIndex: index, text: child.text });
    } else {
      if (currentRun.length > 0) {
        runs.push(currentRun);
        currentRun = [];
      }
    }
  }

  if (currentRun.length > 0) {
    runs.push(currentRun);
  }

  return runs;
};

const buildSegments = (run: TextChild[]): TextSegment[] => {
  let offset = 0;

  return run.map(({ childIndex, text }) => {
    const segment = { childIndex, start: offset, length: text.length };
    offset += text.length;

    return segment;
  });
};

/** Map a combined-text offset back to a Slate point in the correct text node. */
const toPoint = (segments: TextSegment[], combinedOffset: number, elementPath: Path): Point => {
  for (const segment of segments) {
    if (combinedOffset < segment.start + segment.length) {
      return {
        path: PathApi.child(elementPath, segment.childIndex),
        offset: combinedOffset - segment.start,
      };
    }
  }

  const last = segments.at(-1);

  if (last === undefined) {
    return { path: elementPath, offset: 0 };
  }

  return {
    path: PathApi.child(elementPath, last.childIndex),
    offset: last.length,
  };
};
