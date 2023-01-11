import { Editor, Element, Range, Transforms } from 'slate';
import { getCurrentElement, isBlockActive } from '../../functions/blocks';
import { isPlaceholderSelectedInMaltekstWithOverlap } from '../../functions/insert-placeholder';
import { ContentTypeEnum, TableContentEnum, TableTypeEnum } from '../../types/editor-enums';
import { isOfElementType, isOfElementTypeFn, isUndeletableElement } from '../../types/editor-type-guards';
import { ParagraphElementType } from '../../types/editor-types';
import { HandlerFn } from './types';

export const deleteHandler: HandlerFn = ({ editor, event }) => {
  if (isPlaceholderSelectedInMaltekstWithOverlap(editor)) {
    event.preventDefault();

    return;
  }

  const isCollapsed = Range.isCollapsed(editor.selection);

  if (isCollapsed) {
    const isInTableCell = isBlockActive(editor, TableContentEnum.TD);

    if (isInTableCell && Editor.isEnd(editor, editor.selection.focus, editor.selection.focus.path)) {
      event.preventDefault();

      return;
    }

    if (!isInTableCell) {
      const nextNode = Editor.next(editor, {
        at: editor.selection,
        mode: 'highest',
        match: (n) => !Editor.isEditor(n),
      });

      if (nextNode === undefined) {
        return;
      }

      if (Element.isElement(nextNode[0]) && isUndeletableElement(nextNode[0])) {
        event.preventDefault();

        return;
      }

      if (isOfElementType(nextNode[0], TableTypeEnum.TABLE)) {
        event.preventDefault();

        const currentElementEntry = getCurrentElement<ParagraphElementType>(editor, ContentTypeEnum.PARAGRAPH);

        if (currentElementEntry === undefined) {
          return;
        }

        const [currentElement] = currentElementEntry;

        if (isOfElementType(currentElement, ContentTypeEnum.PARAGRAPH) && Editor.isEmpty(editor, currentElement)) {
          Transforms.removeNodes(editor, { match: isOfElementTypeFn(ContentTypeEnum.PARAGRAPH) });
        }
      }
    }
  }
};
