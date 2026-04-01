import {
  NodeApi,
  PathApi,
  type PluginConfig,
  PointApi,
  type Range,
  type SlateEditor,
  TextApi,
  type TText,
} from 'platejs';
import { ELEMENT_MALTEKST, ELEMENT_PLACEHOLDER } from '@/plate/plugins/element-types';

const SEARCH_REPLACE_KEY = 'search_highlight';

export type FindReplaceConfig = PluginConfig<
  typeof SEARCH_REPLACE_KEY,
  {
    search: string;
    caseSensitive: boolean;
  }
>;

const isDirectlyAfter = (editor: SlateEditor, before: Range, after: Range): boolean => {
  if (!PathApi.equals(PathApi.next(before.focus.path), after.anchor.path)) {
    return false;
  }

  const node = editor.api.node<TText>(before.focus.path);

  if (node === undefined) {
    return false;
  }

  return before.focus.offset === node[0].text.length && after.anchor.offset === 0;
};

// Ranges from @platejs/find-replace/decorateFindReplace consist of matches for individual text nodes
// This function groups ranges that are part of the same complete match (i.e. spans multiple text nodes)
export const groupRanges = (editor: SlateEditor, ranges: Range[]): Range[][] =>
  ranges
    .toSorted((a, b) => PointApi.compare(a.anchor, b.anchor))
    .reduce<Range[][]>((groups, range, i, arr) => {
      if (i === 0) {
        return [[range]];
      }

      const prev = arr[i - 1];

      if (prev === undefined) {
        return groups;
      }

      if (isDirectlyAfter(editor, prev, range)) {
        groups.at(-1)?.push(range);
      } else {
        groups.push([range]);
      }

      return groups;
    }, [])
    // Remove groups that are in maltekst but not completely in placeholder
    .filter((group) => {
      const nodes = editor.api.nodes({ at: getRangeFromGroup(group), match: (n) => TextApi.isText(n) });

      for (const [, path] of nodes) {
        if (isInElementType(editor, path, ELEMENT_MALTEKST)) {
          if (!isInElementType(editor, path, ELEMENT_PLACEHOLDER)) {
            return false;
          }
        }
      }

      return true;
    });

const isInElementType = (editor: SlateEditor, path: number[], type: string): boolean => {
  const ancestors = NodeApi.ancestors(editor, path);

  for (const [ancestor] of ancestors) {
    if (ancestor.type === type) {
      return true;
    }
  }

  return false;
};

export const getRangeFromGroup = (group: Range[]): Range => {
  const anchor = group.at(0)?.anchor;
  const focus = group.at(-1)?.focus;

  if (anchor === undefined || focus === undefined) {
    throw new Error('Unexpected error grouping ranges');
  }

  return { anchor, focus };
};
