import { Editor, Location, Range, Text, Transforms } from 'slate';
import { ContentTypeEnum, HeadingTypesEnum, UndeletableVoidElementsEnum } from '../types/editor-enums';
import { PageBreakElementType } from '../types/editor-void-types';
import { areBlocksActive } from './blocks';
import { containsVoid } from './contains-void';

export const insertPageBreakIsAvailable = (editor: Editor) => {
  if (editor.selection === null || Range.isExpanded(editor.selection)) {
    return false;
  }

  if (editor.selection.focus.path.length !== 2) {
    return false;
  }

  if (containsVoid(editor, editor.selection)) {
    return false;
  }

  if (!areBlocksActive(editor, [ContentTypeEnum.PARAGRAPH, ...Object.values(HeadingTypesEnum)], true)) {
    return false;
  }

  return true;
};

export const insertPageBreak = (editor: Editor): void => {
  if (editor.selection === null) {
    return;
  }

  if (!insertPageBreakIsAvailable(editor)) {
    return;
  }

  const pageBreak: PageBreakElementType = { type: UndeletableVoidElementsEnum.PAGE_BREAK, children: [{ text: '' }] };

  Transforms.insertNodes(editor, pageBreak);
  const [pageBreakNode] = Editor.nodes<PageBreakElementType>(editor, {
    match: (n) => n === pageBreak,
    voids: true,
    at: [],
  });

  if (pageBreakNode === undefined) {
    return;
  }

  const [, path] = pageBreakNode;
  const at: Location = { anchor: { path, offset: 0 }, focus: Editor.end(editor, []) };

  const [nextEntry] = Editor.nodes(editor, {
    match: Text.isText,
    voids: false,
    at,
  });

  if (nextEntry === undefined) {
    return;
  }

  const [, nextPath] = nextEntry;

  Transforms.select(editor, { path: nextPath, offset: 0 });
};
