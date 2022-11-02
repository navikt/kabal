import { Editor, Path, Point, Range, Transforms } from 'slate';
import { getCurrentElement, isBlockActive } from '../../functions/blocks';
import { isPlaceholderSelectedInMaltekstWithOverlap } from '../../functions/insert-placeholder';
import { ContentTypeEnum, ListContentEnum, TableContentEnum, TableTypeEnum } from '../../types/editor-enums';
import { isOfElementType, isOfElementTypeFn } from '../../types/editor-type-guards';
import { ListItemContainerElementType, ParagraphElementType } from '../../types/editor-types';
import { unindentList } from '../slate-event-handlers/list/unindent';
import { getTrailingCharacters, getTrailingSpaces } from './helpers';
import { HandlerFn } from './types';

export const backspace: HandlerFn = ({ editor, event }) => {
  if (isPlaceholderSelectedInMaltekstWithOverlap(editor)) {
    event.preventDefault();

    return;
  }

  const isCollapsed = Range.isCollapsed(editor.selection);

  if ((event.altKey || event.ctrlKey || event.metaKey) && isCollapsed) {
    const parentPath = Path.parent(editor.selection.focus.path);
    const path = [...parentPath, 0];

    // If at start of element, use default behavior.
    if (Editor.isStart(editor, editor.selection.focus, path)) {
      return;
    }

    event.preventDefault();

    const at: Range = {
      anchor: {
        path,
        offset: 0,
      },
      focus: editor.selection.focus,
    };

    // Delete line.
    if (event.metaKey) {
      Transforms.delete(editor, {
        unit: 'character',
        at,
        reverse: true,
      });

      return;
    }

    // Delete word.
    const string = Editor.string(editor, at);
    const spaces = getTrailingSpaces(string);
    const distance = spaces === 0 ? getTrailingCharacters(string) : spaces;

    Transforms.delete(editor, {
      unit: 'character',
      distance,
      at: editor.selection,
      reverse: true,
    });

    return;
  }

  if (isBlockActive(editor, ListContentEnum.LIST_ITEM_CONTAINER) && editor.selection.focus.offset === 0) {
    const [firstEntry] = Editor.nodes<ListItemContainerElementType>(editor, {
      match: isOfElementTypeFn(ListContentEnum.LIST_ITEM_CONTAINER),
      mode: 'lowest',
      reverse: true,
    });

    if (firstEntry === undefined) {
      return;
    }

    const [, path] = firstEntry;

    const start = Editor.start(editor, path);

    if (isCollapsed && Point.equals(editor.selection.focus, start)) {
      event.preventDefault();
      unindentList(editor);
    }
  }

  if (isCollapsed) {
    const isInTableCell = isBlockActive(editor, TableContentEnum.TD);

    if (isInTableCell && editor.selection.focus.offset === 0) {
      event.preventDefault();

      return;
    }

    if (!isInTableCell) {
      const previousNode = Editor.previous(editor, {
        at: editor.selection,
        mode: 'highest',
        match: (n) => !Editor.isEditor(n),
      });

      if (previousNode === undefined) {
        return;
      }

      if (isOfElementType(previousNode[0], TableTypeEnum.TABLE)) {
        event.preventDefault();

        const currentElementEntry = getCurrentElement<ParagraphElementType>(editor, ContentTypeEnum.PARAGRAPH);

        if (currentElementEntry === undefined) {
          return;
        }

        const [currentElement] = currentElementEntry;

        if (isOfElementType(currentElement, ContentTypeEnum.PARAGRAPH) && Editor.isEmpty(editor, currentElement)) {
          Transforms.removeNodes(editor, { match: isOfElementTypeFn(ContentTypeEnum.PARAGRAPH) });
          Transforms.move(editor, { distance: 1, reverse: true });
        }
      }
    }
  }
};
