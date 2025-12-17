import { PathApi, type Point, type TRange, type TText } from 'platejs';
import type { PlateEditor } from 'platejs/react';

/**
 *
 * @param editor
 * @param point
 * @returns Range of word where collapsed marker is located
 */
export const getWordRange = (editor: PlateEditor, point: Point): TRange => {
  const focus = findStartOfWord(editor, point);
  const anchor = findEndOfWord(editor, point);

  return { anchor, focus };
};

const findStartOfWord = (editor: PlateEditor, point: Point): Point => {
  const currentTextEntry = editor.api.node<TText>({ at: point, text: true });

  if (currentTextEntry === undefined) {
    return point;
  }

  const [node, path] = currentTextEntry;

  const spacePosition = node.text.lastIndexOf(' ', point.offset - 1);

  // Found space in current text node
  if (spacePosition !== -1) {
    return { path, offset: spacePosition + 1 };
  }

  const prevText = editor.api.previous<TText>({ at: path, text: true });

  // Must be start of document
  if (prevText === undefined) {
    return { path, offset: 0 };
  }

  const currentBlock = editor.api.block({ at: path });
  const prevBlock = editor.api.block({ at: prevText[1] });

  // Current text node and prev text node are in different blocks - start of current node is start of word
  if (currentBlock !== undefined && prevBlock !== undefined && !PathApi.equals(currentBlock[1], prevBlock[1])) {
    return { path, offset: 0 };
  }

  const [prevNode, prevPath] = prevText;

  // Start of word not yet found - continue searching backwards in previous text node
  return findStartOfWord(editor, { path: prevPath, offset: prevNode.text.length });
};

const findEndOfWord = (editor: PlateEditor, point: Point): Point => {
  const currentTextEntry = editor.api.node<TText>({ at: point, text: true });

  if (currentTextEntry === undefined) {
    return point;
  }

  const [node, path] = currentTextEntry;

  const spacePosition = node.text.indexOf(' ', point.offset);

  // Found space in current text node
  if (spacePosition !== -1) {
    return { path, offset: spacePosition };
  }

  const nextText = editor.api.next<TText>({ at: path, text: true });

  // Must be end of document
  if (nextText === undefined) {
    return { path, offset: node.text.length };
  }

  const currentBlock = editor.api.block({ at: path });
  const nextBlock = editor.api.block({ at: nextText[1] });

  // Current text node and next text node are in different blocks - end of current node is end of word
  if (currentBlock !== undefined && nextBlock !== undefined && !PathApi.equals(currentBlock[1], nextBlock[1])) {
    return { path, offset: node.text.length };
  }

  const [, nextPath] = nextText;

  // End of word not yet found - continue searching forwards in next text node
  return findEndOfWord(editor, { path: nextPath, offset: 0 });
};
