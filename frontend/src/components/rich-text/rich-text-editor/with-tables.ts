import { Editor } from 'slate';
import { TableContentEnum } from '../types/editor-enums';
import { isOfElementTypeFn } from '../types/editor-type-guards';

export const withTables = (editor: Editor) => {
  const { insertData, insertText, deleteBackward, deleteForward, deleteFragment } = editor;

  editor.deleteBackward = (unit) => {
    if (hasMultiCellSelection(editor)) {
      return;
    }
    deleteBackward(unit);
  };

  editor.deleteForward = (unit) => {
    if (hasMultiCellSelection(editor)) {
      return;
    }
    deleteForward(unit);
  };

  editor.deleteFragment = () => {
    if (hasMultiCellSelection(editor)) {
      return;
    }
    deleteFragment();
  };

  editor.insertText = (text) => {
    if (hasMultiCellSelection(editor)) {
      return;
    }
    insertText(text);
  };

  editor.insertData = (data) => {
    if (hasMultiCellSelection(editor)) {
      return;
    }
    insertData(data);
  };

  return editor;
};

const hasMultiCellSelection = (editor: Editor) => {
  const { selection } = editor;

  if (selection === null) {
    return false;
  }

  const cellEntries = Editor.nodes(editor, {
    match: isOfElementTypeFn(TableContentEnum.TD),
  });

  let cellCount = 0;

  while (cellEntries.next().done !== true) {
    cellCount++;

    if (cellCount > 1) {
      return true;
    }
  }

  return false;
};
