import { type Path, PathApi, type Point, type TElement, TextApi } from 'platejs';

const UNICODE_SPACE_SEQUENCE = /\p{Zs}{2,}/gu;
const LEADING_WHITESPACE = /^\p{Zs}+/u;
const TRAILING_WHITESPACE = /\p{Zs}+$/u;
/** Match spaces before punctuation. */
const SPACE_BEFORE_PUNCTUATION = /\p{Zs}+(?=[.,:;!?)\u2026])/gu;
/** Match spaces immediately after a forced newline (`\n`). */
const LEADING_SPACE_AFTER_NEWLINE = /\n\p{Zs}+/gu;
/** Match spaces immediately before a forced newline (`\n`). */
const TRAILING_SPACE_BEFORE_NEWLINE = /\p{Zs}+\n/gu;

export enum WhitespaceIssueType {
  DoubleSpace = 0,
  LeadingWhitespace = 1,
  TrailingWhitespace = 2,
  SpaceBeforePunctuation = 3,
}

export type WhitespaceIssue =
  | { type: WhitespaceIssueType.DoubleSpace; anchor: Point; focus: Point; deleteAnchor: Point }
  | { type: WhitespaceIssueType.LeadingWhitespace; anchor: Point; focus: Point }
  | { type: WhitespaceIssueType.TrailingWhitespace; anchor: Point; focus: Point }
  | { type: WhitespaceIssueType.SpaceBeforePunctuation; anchor: Point; focus: Point };

/** Find whitespace issues in an element: double spaces, leading/trailing whitespace, and spaces before punctuation. */
export const findWhitespaceIssues = (element: TElement, elementPath: Path): WhitespaceIssue[] => {
  const runs = getConsecutiveTextRuns(element);

  if (runs.length === 0) {
    return [];
  }

  const firstChild = runs.at(0)?.at(0);
  const lastChild = runs.at(-1)?.at(-1);
  const isFirstRunAtStart = firstChild !== undefined && firstChild.childIndex === 0;
  const isLastRunAtEnd = lastChild !== undefined && lastChild.childIndex === element.children.length - 1;

  return runs.flatMap((run, i) =>
    findIssuesInRun(run, elementPath, i === 0 && isFirstRunAtStart, i === runs.length - 1 && isLastRunAtEnd),
  );
};

const findIssuesInRun = (
  run: TextChild[],
  elementPath: Path,
  checkLeading: boolean,
  checkTrailing: boolean,
): WhitespaceIssue[] => {
  const issues: WhitespaceIssue[] = [];
  const combinedText = run.map(({ text }) => text).join('');
  const segments = buildSegments(run);

  if (checkLeading) {
    const match = combinedText.match(LEADING_WHITESPACE);

    if (match !== null) {
      issues.push({
        type: WhitespaceIssueType.LeadingWhitespace,
        anchor: toPoint(segments, 0, elementPath),
        focus: toPoint(segments, match[0].length, elementPath),
      });
    }
  }

  if (checkTrailing) {
    const match = combinedText.match(TRAILING_WHITESPACE);

    if (match !== null && match.index !== undefined) {
      issues.push({
        type: WhitespaceIssueType.TrailingWhitespace,
        anchor: toPoint(segments, match.index, elementPath),
        focus: toPoint(segments, match.index + match[0].length, elementPath),
      });
    }
  }

  for (const match of combinedText.matchAll(LEADING_SPACE_AFTER_NEWLINE)) {
    if (match.index === undefined) {
      continue;
    }

    // Anchor after the `\n`, focus at end of spaces.
    const spaceStart = match.index + 1;

    issues.push({
      type: WhitespaceIssueType.LeadingWhitespace,
      anchor: toPoint(segments, spaceStart, elementPath),
      focus: toPoint(segments, match.index + match[0].length, elementPath),
    });
  }

  for (const match of combinedText.matchAll(TRAILING_SPACE_BEFORE_NEWLINE)) {
    if (match.index === undefined) {
      continue;
    }

    // Anchor at start of spaces, focus before the `\n`.
    issues.push({
      type: WhitespaceIssueType.TrailingWhitespace,
      anchor: toPoint(segments, match.index, elementPath),
      focus: toPoint(segments, match.index + match[0].length - 1, elementPath),
    });
  }

  for (const match of combinedText.matchAll(SPACE_BEFORE_PUNCTUATION)) {
    if (match.index === undefined) {
      continue;
    }

    issues.push({
      type: WhitespaceIssueType.SpaceBeforePunctuation,
      anchor: toPoint(segments, match.index, elementPath),
      focus: toPoint(segments, match.index + match[0].length, elementPath),
    });
  }

  for (const match of combinedText.matchAll(UNICODE_SPACE_SEQUENCE)) {
    if (match.index === undefined) {
      continue;
    }

    issues.push({
      type: WhitespaceIssueType.DoubleSpace,
      anchor: toPoint(segments, match.index, elementPath),
      focus: toPoint(segments, match.index + match[0].length, elementPath),
      deleteAnchor: toPoint(segments, match.index + 1, elementPath),
    });
  }

  return issues;
};

interface TextChild {
  childIndex: number;
  text: string;
}
interface TextSegment {
  childIndex: number;
  start: number;
  length: number;
}

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
