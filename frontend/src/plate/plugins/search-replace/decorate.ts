import {
  ELEMENT_CURRENT_DATE,
  ELEMENT_FOOTER,
  ELEMENT_HEADER,
  ELEMENT_LABEL_CONTENT,
  ELEMENT_SIGNATURE,
} from '@app/plate/plugins/element-types';
import { type FindReplaceConfig, groupRanges } from '@app/plate/plugins/search-replace/search-replace';
import type { Decorate, Path, TRange } from 'platejs';
import { ElementApi, NodeApi, TextApi } from 'platejs';

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
  const { search } = getOptions();

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

  const str = texts.join('').toLowerCase();
  const searchLower = search.toLowerCase();

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
