import { BookmarkPlugin } from '@app/plate/plugins/bookmark';
import { CommentsPlugin } from '@app/plate/plugins/comments';
import { getLong } from '@app/plate/plugins/custom-abbreviations/get-long';
import type { FormattedText } from '@app/plate/types';
import { type NodeEntry, PathApi, RangeApi } from '@udecode/plate';
import type { PlateEditor } from '@udecode/plate-core/react';
import type { Range } from 'slate';

type Marks = Omit<FormattedText, 'text'>;

interface AbbreviationData {
  long: string;
  short: string;
  range: Range;
  marks: Marks;
}

export const getAbbreviationData = (editor: PlateEditor): AbbreviationData | null => {
  const { selection } = editor;

  if (selection === null || RangeApi.isExpanded(selection)) {
    return null;
  }

  const lineStart = editor.api.before(selection, { unit: 'line', distance: 1 });

  if (lineStart === undefined) {
    return null;
  }

  const fromLineStartToCaretRange: Range = { anchor: lineStart, focus: selection.focus };

  if (RangeApi.isCollapsed(fromLineStartToCaretRange)) {
    return null;
  }

  const textNodes = editor.api
    .nodes<FormattedText>({ at: fromLineStartToCaretRange, mode: 'lowest', text: true })
    .map<FormattedText>(([node, path], i) => {
      const isFirst = i === 0;
      const isLast = PathApi.equals(path, fromLineStartToCaretRange.focus.path);

      if (isFirst && isLast) {
        return {
          ...node,
          text: node.text.slice(fromLineStartToCaretRange.anchor.offset, fromLineStartToCaretRange.focus.offset),
        };
      }

      if (isFirst) {
        return {
          ...node,
          text: node.text.slice(fromLineStartToCaretRange.anchor.offset),
        };
      }

      if (isLast) {
        return { ...node, text: node.text.slice(0, fromLineStartToCaretRange.focus.offset) };
      }

      return node;
    });

  const { uncapitalisedShort, capitalisedShort, autoCapitalised, previousWord } = getWords(textNodes);

  if (
    uncapitalisedShort === undefined ||
    uncapitalisedShort.length === 0 ||
    capitalisedShort === undefined ||
    capitalisedShort.length === 0
  ) {
    return null;
  }

  const long =
    getLong(uncapitalisedShort, previousWord) ?? (autoCapitalised ? getLong(capitalisedShort, previousWord) : null);

  if (long === null) {
    return null;
  }

  const anchor = editor.api.before(selection, { unit: 'character', distance: uncapitalisedShort.length });

  if (anchor === undefined) {
    return null;
  }

  const range: Range = { anchor, focus: selection.focus };

  const entries = editor.api
    .nodes<FormattedText>({ at: range, mode: 'lowest', match: (n) => editor.api.isText(n) })
    .toArray();

  if (entries.length === 0) {
    return null;
  }

  return { short: uncapitalisedShort, long, marks: getMarks(entries), range };
};

interface Words {
  uncapitalisedShort: string | undefined;
  capitalisedShort: string | undefined;
  autoCapitalised: boolean;
  previousWord: string | undefined;
}

const getWords = (textNodes: Iterable<FormattedText>): Words => {
  let uncapitalised = '';
  let capitalised = '';

  for (const node of textNodes) {
    uncapitalised += node.autoCapitalised === true ? node.text.toLowerCase() : node.text;
    capitalised += node.text;
  }

  const uncapitalisedWords = uncapitalised.split(' ');
  const capitalisedWords = capitalised.split(' ');

  const uncapitalisedShort = uncapitalisedWords.at(-1);
  const capitalisedShort = capitalisedWords.at(-1);

  return {
    uncapitalisedShort,
    capitalisedShort,
    autoCapitalised: capitalisedShort !== uncapitalisedShort,
    previousWord: capitalisedWords.at(-2),
  };
};

const getMarks = (entries: NodeEntry<FormattedText>[]): Marks =>
  entries.reduce<Marks>((acc, [node]) => {
    if (node.bold === true) {
      acc.bold = true;
    }

    if (node.italic === true) {
      acc.italic = true;
    }

    if (node.underline === true) {
      acc.underline = true;
    }

    if (node[CommentsPlugin.key] !== undefined) {
      acc[CommentsPlugin.key] = node[CommentsPlugin.key];
    }

    if (node[BookmarkPlugin.key] !== undefined) {
      acc[BookmarkPlugin.key] = node[BookmarkPlugin.key];
    }

    return acc;
  }, {});
