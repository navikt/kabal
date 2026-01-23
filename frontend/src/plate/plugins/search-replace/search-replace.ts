import { InsertPlugin } from '@app/plate/plugins/capitalise/capitalise';
import { ELEMENT_MALTEKST, ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { decorate } from '@app/plate/plugins/search-replace/decorate';
import {
  createTSlatePlugin,
  type DecoratedRange,
  ElementApi,
  getEditorPlugin,
  NodeApi,
  type Path,
  PathApi,
  type PluginConfig,
  PointApi,
  type Range,
  type SlateEditor,
  TextApi,
  type TText,
} from 'platejs';
import type { PlateEditor } from 'platejs/react';

const SEARCH_REPLACE_KEY = 'search_highlight';

export type FindReplaceConfig = PluginConfig<
  typeof SEARCH_REPLACE_KEY,
  {
    search: string;
    caseSensitive: boolean;
  }
>;

export const SearchReplacePlugin = createTSlatePlugin<FindReplaceConfig>({
  key: SEARCH_REPLACE_KEY,
  node: { isLeaf: true },
  options: { search: '', caseSensitive: false },
  decorate,
});

const REPLACE_ONE_HIGHLIGHT_KEY = 'highlight_search';

type HighlightSearchConfig = PluginConfig<typeof REPLACE_ONE_HIGHLIGHT_KEY, { highlight: DecoratedRange[] }>;

// Highlights next item that will be replaced
export const ReplaceOneHighlightPlugin = createTSlatePlugin<HighlightSearchConfig>({
  key: REPLACE_ONE_HIGHLIGHT_KEY,
  node: { isLeaf: true },
  options: { highlight: [] },
  decorate: ({ getOptions, type, entry: [node] }) => {
    if (!ElementApi.isElement(node) || !node.children.some(TextApi.isText)) {
      return [];
    }

    const { highlight } = getOptions();

    return highlight.length === 0 ? [] : highlight.map((range) => ({ ...range, [type]: true }));
  },
});

export const replaceText = (
  editor: PlateEditor,
  search: string | undefined,
  replace: string,
  autoCapitalise: boolean,
): void => {
  if (search === undefined || search.length === 0) {
    return;
  }

  const decorations = getAllDecorations(editor);
  const completeMatchRanges = mergeRanges(editor, decorations);
  const { insertCapitalised } = editor.getTransforms(InsertPlugin);

  editor.tf.withoutNormalizing(() => {
    // Traverse in reverse order to avoid messing up the positions of earlier ranges
    for (const at of completeMatchRanges.toReversed()) {
      editor.tf.select(at);

      autoCapitalise ? insertCapitalised(replace, { at }) : editor.tf.insertText(replace, { at });
    }
  });
};

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

// Create new range that may span multiple text nodes for the search hit. Remove intermediate ranges.
export const mergeRanges = (editor: PlateEditor, ranges: Range[]) => groupRanges(editor, ranges).map(getRangeFromGroup);

export const getAllDecorations = (editor: PlateEditor) => {
  const plugin = editor.getPlugin(SearchReplacePlugin);
  const allDecorations = [];

  for (const entry of NodeApi.nodes(editor)) {
    const ranges = plugin.decorate?.({ ...getEditorPlugin(editor, plugin), entry });

    if (ranges !== undefined) {
      allDecorations.push(...ranges);
    }
  }

  return allDecorations;
};

const isInElementType = (editor: SlateEditor, path: Path, type: string): boolean => {
  const ancestors = NodeApi.ancestors(editor, path);

  for (const [ancestor] of ancestors) {
    if (ancestor.type === type) {
      return true;
    }
  }

  return false;
};

const getRangeFromGroup = (group: Range[]): Range => {
  const anchor = group.at(0)?.anchor;
  const focus = group.at(-1)?.focus;

  if (anchor === undefined || focus === undefined) {
    throw new Error('Unexpected error grouping ranges');
  }

  return { anchor, focus };
};
