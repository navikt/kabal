import { createTSlatePlugin, type Decorate, ElementApi } from 'platejs';
import { PlateLeaf, type PlateLeafProps } from 'platejs/react';
import { findWhitespaceIssues } from '@/plate/plugins/find-whitespace-issues';

const WHITESPACE_ISSUE_KEY = 'whitespace-issue';

const decorateWhitespaceIssues: Decorate = ({ editor, entry: [node, path], type }) => {
  if (!ElementApi.isElement(node)) {
    return [];
  }

  const isInline = editor.api.isInline(node);

  return findWhitespaceIssues(node, path, isInline ? { collapseLeading: true, strictTrailing: true } : undefined).map(
    ({ anchor, focus }) => ({
      anchor,
      focus,
      [type]: true,
    }),
  );
};

export const WhitespaceIssueLeaf = (props: PlateLeafProps) => (
  <PlateLeaf {...props} className="underline decoration-ax-text-danger-subtle decoration-wavy underline-offset-2" />
);

export const WhitespaceDecorationPlugin = createTSlatePlugin({
  key: WHITESPACE_ISSUE_KEY,
  node: { isLeaf: true },
  decorate: decorateWhitespaceIssues,
});
