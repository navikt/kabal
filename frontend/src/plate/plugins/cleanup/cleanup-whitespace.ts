import { ElementApi, PointApi, TextApi, type TRange } from 'platejs';
import type { PlateEditor } from 'platejs/react';
import {
  findWhitespaceIssues,
  type WhitespaceIssue,
  WhitespaceIssueType,
} from '@/plate/plugins/find-whitespace-issues';

/** Clean up all whitespace issues: double spaces, leading/trailing whitespace, spaces before punctuation. */
export const cleanupWhitespaceIssues = (editor: PlateEditor): void => {
  const elementEntries = editor.api
    .nodes({
      at: [],
      match: (n) => ElementApi.isElement(n) && n.children.some((child) => TextApi.isText(child)),
      reverse: true,
    })
    .toArray();

  // Must convert to array first. Otherwise the content changes between matches.
  for (const [element, elementPath] of elementEntries) {
    if (!ElementApi.isElement(element)) {
      continue;
    }

    const issues = findWhitespaceIssues(element, elementPath);
    const deleteRanges = mergeDeleteRanges(issues);

    for (const range of deleteRanges.toReversed()) {
      editor.tf.delete({ at: range });
    }
  }
};

/** Convert issues to delete ranges and merge overlapping ones. */
const mergeDeleteRanges = (issues: WhitespaceIssue[]): TRange[] => {
  const deleteRanges: TRange[] = issues.map((issue) =>
    issue.type === WhitespaceIssueType.DoubleSpace
      ? { anchor: issue.deleteAnchor, focus: issue.focus }
      : { anchor: issue.anchor, focus: issue.focus },
  );

  deleteRanges.sort((a, b) => PointApi.compare(a.anchor, b.anchor));

  const merged: TRange[] = [];

  for (const range of deleteRanges) {
    const last = merged.at(-1);

    if (last !== undefined && PointApi.compare(range.anchor, last.focus) <= 0) {
      if (PointApi.compare(range.focus, last.focus) > 0) {
        last.focus = { ...range.focus, path: [...range.focus.path] };
      }
    } else {
      merged.push({
        anchor: { ...range.anchor, path: [...range.anchor.path] },
        focus: { ...range.focus, path: [...range.focus.path] },
      });
    }
  }

  return merged;
};
