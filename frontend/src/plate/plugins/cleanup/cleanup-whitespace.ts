import { type At, ElementApi, type Path, PointApi, RangeApi, type TElement, TextApi, type TRange } from 'platejs';
import type { PlateEditor } from 'platejs/react';
import {
  type FindWhitespaceIssuesOptions,
  findWhitespaceIssues,
  type WhitespaceIssue,
} from '@/plate/plugins/find-whitespace-issues';

/** Clean up all whitespace issues: double spaces, leading/trailing whitespace, spaces before punctuation. */
export const cleanupWhitespaceIssues = (editor: PlateEditor, at: At = []): void => {
  const blockEntries = editor.api
    .nodes({
      at,
      match: (n) =>
        ElementApi.isElement(n) && !editor.api.isInline(n) && n.children.some((child) => TextApi.isText(child)),
      reverse: true,
    })
    .toArray();

  for (const [element, elementPath] of blockEntries) {
    if (!ElementApi.isElement(element)) {
      continue;
    }

    // Clean block-level issues (cross-boundary delete ranges reach into inline elements).
    applyCleanup(editor, element, elementPath);

    // Clean remaining issues inside inline children (re-queries to see post-cleanup state).
    const inlineEntries = editor.api
      .nodes({
        at: elementPath,
        match: (n) =>
          ElementApi.isElement(n) && editor.api.isInline(n) && n.children.some((child) => TextApi.isText(child)),
        reverse: true,
      })
      .toArray();

    for (const [inlineElement, inlinePath] of inlineEntries) {
      if (!ElementApi.isElement(inlineElement)) {
        continue;
      }

      applyCleanup(editor, inlineElement, inlinePath, { collapseLeading: true, strictTrailing: true });
    }
  }
};

const applyCleanup = (
  editor: PlateEditor,
  element: TElement,
  elementPath: Path,
  options?: FindWhitespaceIssuesOptions,
): void => {
  const issues = findWhitespaceIssues(element, elementPath, options);
  const deleteRanges = mergeDeleteRanges(issues);

  for (const range of deleteRanges.toReversed()) {
    editor.tf.delete({ at: range });
  }
};

/** Flatten all issue delete ranges, sort, and merge overlapping ones. */
const mergeDeleteRanges = (issues: WhitespaceIssue[]): TRange[] => {
  const deleteRanges = issues
    .flatMap((issue) => issue.deleteRanges)
    .toSorted((a, b) => PointApi.compare(a.anchor, b.anchor));

  const merged: TRange[] = [];

  for (const range of deleteRanges) {
    const last = merged.at(-1);

    if (last !== undefined && PointApi.compare(range.anchor, last.focus) <= 0) {
      if (PointApi.isAfter(range.focus, last.focus)) {
        last.focus = range.focus;
      }
    } else {
      merged.push({ anchor: range.anchor, focus: range.focus });
    }
  }

  return merged.filter((range) => RangeApi.isExpanded(range));
};
