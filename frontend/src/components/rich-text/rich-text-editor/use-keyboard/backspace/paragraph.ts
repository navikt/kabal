import { Editor, Element, Transforms } from 'slate';
import { getCurrentElement } from '../../../functions/blocks';
import { ContentTypeEnum } from '../../../types/editor-enums';
import { isUndeletableElement } from '../../../types/editor-type-guards';
import { ParagraphElementType } from '../../../types/editor-types';
import { HandlerFn } from '../types';

export const handleParagraph: HandlerFn = ({ editor, event, isCollapsed }) => {
  const paragraphEntry = getCurrentElement<ParagraphElementType>(editor, ContentTypeEnum.PARAGRAPH);

  if (typeof paragraphEntry === 'undefined') {
    return;
  }

  const [paragraphNode, paragraphPath] = paragraphEntry;

  if (editor.selection === null || !isCollapsed || editor.selection.focus.offset !== 0) {
    return;
  }

  const isFirstElementInParent = paragraphPath[paragraphPath.length - 1] === 0;

  // If the paragraph is the first element in its parent, we don't want to delete it.
  if (isFirstElementInParent) {
    event.preventDefault();

    return;
  }

  const previousEntry = Editor.previous(editor, {
    at: paragraphPath,
    match: Element.isElement,
    voids: true,
    mode: 'highest',
  });

  if (typeof previousEntry === 'undefined' || isUndeletableElement(previousEntry[0])) {
    event.preventDefault();

    return;
  }

  if (Editor.isEmpty(editor, paragraphNode)) {
    event.preventDefault();

    Editor.withoutNormalizing(editor, () => {
      Transforms.removeNodes(editor, {
        at: paragraphPath,
        match: (n) => n === paragraphNode,
      });

      if (Editor.hasPath(editor, paragraphPath)) {
        Transforms.move(editor, { distance: 1, unit: 'character', reverse: true });
      }
    });
  }
};
