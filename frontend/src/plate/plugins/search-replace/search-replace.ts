import {
  createTSlatePlugin,
  type DecoratedRange,
  ElementApi,
  getEditorPlugin,
  NodeApi,
  type PluginConfig,
  type Range,
  TextApi,
} from 'platejs';
import type { PlateEditor } from 'platejs/react';
import { InsertPlugin } from '@/plate/plugins/capitalise/capitalise';
import { decorate } from '@/plate/plugins/search-replace/decorate';
import { type FindReplaceConfig, getRangeFromGroup, groupRanges } from '@/plate/plugins/search-replace/group-ranges';

const SEARCH_REPLACE_KEY = 'search_highlight';

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
