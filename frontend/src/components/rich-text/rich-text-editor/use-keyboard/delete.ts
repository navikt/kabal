import { Editor, Path, Range, Transforms } from 'slate';
import { getCurrentElement, isBlockActive } from '../../functions/blocks';
import { isPlaceholderSelectedInMaltekstWithOverlap } from '../../functions/insert-placeholder';
import { ContentTypeEnum, TableContentEnum, TableTypeEnum } from '../../types/editor-enums';
import { isOfElementType, isOfElementTypeFn } from '../../types/editor-type-guards';
import { ParagraphElementType } from '../../types/editor-types';
import { getLeadingCharacters, getLeadingSpaces } from './helpers';
import { HandlerFn } from './types';

export const deleteHandler: HandlerFn = ({ editor, event }) => {
  if (isPlaceholderSelectedInMaltekstWithOverlap(editor)) {
    event.preventDefault();

    return;
  }

  const isCollapsed = Range.isCollapsed(editor.selection);

  if ((event.altKey || event.ctrlKey || event.metaKey) && isCollapsed) {
    const parentPath = Path.parent(editor.selection.focus.path);

    // If at end of element, use default behavior.
    if (Editor.isEnd(editor, editor.selection.focus, parentPath)) {
      return;
    }

    event.preventDefault();

    const at: Range = {
      anchor: editor.selection.anchor,
      focus: Editor.end(editor, [...parentPath, 0]),
    };

    // Delete line.
    if (event.metaKey) {
      Transforms.delete(editor, {
        unit: 'character',
        at,
        reverse: false,
      });

      return;
    }

    // Delete word.
    const string = Editor.string(editor, at);
    const spaces = getLeadingSpaces(string);
    const distance = spaces === 0 ? getLeadingCharacters(string) : spaces;

    Transforms.delete(editor, {
      unit: 'character',
      distance,
      at: editor.selection,
      reverse: false,
    });
  }

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
