import type { Decorate, TRange } from 'platejs';
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
import { InsertPlugin } from '@/plate/plugins/capitalise/capitalise';
import {
  ELEMENT_CURRENT_DATE,
  ELEMENT_FOOTER,
  ELEMENT_HEADER,
  ELEMENT_LABEL_CONTENT,
  ELEMENT_MALTEKST,
  ELEMENT_PLACEHOLDER,
  ELEMENT_SIGNATURE,
} from '@/plate/plugins/element-types';

const NON_EDITABLE_ELEMENTS = [
  ELEMENT_HEADER,
  ELEMENT_FOOTER,
  ELEMENT_CURRENT_DATE,
  ELEMENT_SIGNATURE,
  ELEMENT_LABEL_CONTENT,
];

export const decorate: Decorate<FindReplaceConfig> = (props) => {
  const { editor } = props;

  const notEditable = editor.api.some({
    match: (n) => ElementApi.isElement(n) && NON_EDITABLE_ELEMENTS.includes(n.type),
    voids: true,
    at: props.entry[1],
  });

  if (notEditable) {
    return [];
  }

  const decorations = decorateFindReplace(props);

  return groupRanges(editor, decorations ?? []).flat();
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Copy-pasta from @platejs/find-replace
const decorateFindReplace: Decorate<FindReplaceConfig> = ({ entry: [node, path], getOptions, type }) => {
  const { search, caseSensitive } = getOptions();

  if (search.length === 0 || !ElementApi.isElement(node)) {
    return [];
  }

  const children = NodeApi.children(node, []);

  const texts: string[] = [];
  const paths: Path[] = [];

  for (const [child, childPath] of children) {
    if (TextApi.isText(child)) {
      texts.push(child.text);
      paths.push(path.concat(childPath));
    }
  }

  const joinedText = texts.join('');

  const str = caseSensitive ? joinedText : joinedText.toLowerCase();
  const searchLower = caseSensitive ? search : search.toLowerCase();

  let start = 0;
  const matches: number[] = [];

  while (true) {
    start = str.indexOf(searchLower, start);

    if (start === -1) break;

    matches.push(start);
    start += searchLower.length;
  }

  if (matches.length === 0) {
    return [];
  }

  const ranges: SearchRange[] = [];
  let cumulativePosition = 0;
  let matchIndex = 0; // index in the matches array

  for (const [textIndex, text] of texts.entries()) {
    const textStart = cumulativePosition;
    const textEnd = textStart + text.length;

    const matchStart = matches[matchIndex];

    if (matchStart === undefined) {
      break;
    }

    // Process matches that overlap with the current text node
    while (matchIndex < matches.length && matchStart < textEnd) {
      const matchStart = matches[matchIndex];

      // Should never happen
      if (matchStart === undefined) {
        matchIndex++;
        continue;
      }

      const matchEnd = matchStart + search.length;

      // If the match ends before the start of the current text, move to the next match
      if (matchEnd <= textStart) {
        matchIndex++;

        continue;
      }

      // Calculate overlap between the text and the current match
      const overlapStart = Math.max(matchStart, textStart);
      const overlapEnd = Math.min(matchEnd, textEnd);

      if (overlapStart < overlapEnd) {
        const anchorOffset = overlapStart - textStart;
        const focusOffset = overlapEnd - textStart;

        // Corresponding offsets within the search string
        const searchOverlapStart = overlapStart - matchStart;
        const searchOverlapEnd = overlapEnd - matchStart;

        const textNodePath = paths[textIndex];

        // Should never happen
        if (textNodePath === undefined) {
          matchIndex++;
          continue;
        }

        ranges.push({
          anchor: {
            offset: anchorOffset,
            path: textNodePath,
          },
          focus: {
            offset: focusOffset,
            path: textNodePath,
          },
          search: search.slice(searchOverlapStart, searchOverlapEnd),
          [type]: true,
        });
      }
      // If the match ends within the current text, move to the next match
      if (matchEnd <= textEnd) {
        matchIndex++;
      } else {
        // The match continues in the next text node
        break;
      }
    }

    cumulativePosition = textEnd;
  }

  return ranges;
};

type SearchRange = {
  search: string;
} & TRange;

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
