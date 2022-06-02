import { BasePoint, Editor, Path, Range, Text, Transforms } from 'slate';
import { isBlockActive } from '../../functions/blocks';
import { ContentTypeEnum, ListContentEnum, ListTypesEnum } from '../../types/editor-enums';
import { isOfElementType } from '../../types/editor-type-guards';
import { HandlerFn, HandlerFnArg } from './types';

export const space: HandlerFn = ({ editor, event }) => {
  if (event.key !== ' ') {
    return;
  }

  const { focus } = editor.selection;

  // Focus must be at the beginning of the text node.
  if (focus.offset > 2) {
    return;
  }

  // Focus must be [paragraph, text].
  // Focus must be at the first text node.
  if (focus.path.length !== 2 || focus.path[1] !== 0) {
    return;
  }

  // Selection must be collapsed.
  if (Range.isExpanded(editor.selection)) {
    return;
  }

  // Selection must be in a paragraph.
  if (!isBlockActive(editor, ContentTypeEnum.PARAGRAPH)) {
    return;
  }

  // Get the first text node in the paragraph.
  const [firstTextEntry] = Editor.nodes<Text>(editor, {
    match: Text.isText,
    at: focus,
    voids: false,
    mode: 'lowest',
  });

  if (firstTextEntry === undefined) {
    return;
  }

  // Get the text of the first text node.
  const [{ text }] = firstTextEntry;

  // Check if the text starts with a list prefix.
  if (focus.offset === 1 && (text.startsWith('-') || text.startsWith('*'))) {
    makeList(event, editor, focus, ListTypesEnum.BULLET_LIST, 1);
  } else if (focus.offset === 2 && (text.startsWith('1)') || text.startsWith('a)'))) {
    makeList(event, editor, focus, ListTypesEnum.NUMBERED_LIST, 2);
  }
};

const makeList = (
  event: HandlerFnArg['event'],
  editor: HandlerFnArg['editor'],
  focus: BasePoint,
  listType: ListTypesEnum,
  prefixLength: number
) => {
  event.preventDefault();
  Editor.withoutNormalizing(editor, () => {
    Transforms.delete(editor, {
      at: focus,
      distance: prefixLength,
      unit: 'character',
      voids: false,
      reverse: true,
    });
    Transforms.setNodes(
      editor,
      { type: ListContentEnum.LIST_ITEM_CONTAINER },
      {
        match: (n) => isOfElementType(n, ContentTypeEnum.PARAGRAPH),
        voids: false,
        mode: 'lowest',
        at: Path.parent(focus.path),
      }
    );
    Transforms.wrapNodes(editor, { type: listType, children: [] });
    Transforms.wrapNodes(editor, { type: ListContentEnum.LIST_ITEM, children: [] });
  });
};