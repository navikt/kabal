import { Path } from 'slate';
import { isBlockActive } from '../../../functions/blocks';
import { getCurrentCell } from '../../../functions/table/helpers';
import { TableContentEnum } from '../../../types/editor-enums';
import { HandlerFn } from '../types';

export const handleTableCell: HandlerFn = ({ editor, event }) => {
  const isInTableCell = isBlockActive(editor, TableContentEnum.TD);

  if (!isInTableCell) {
    return;
  }

  const currentCell = getCurrentCell(editor);

  if (currentCell === undefined) {
    return;
  }

  const [, path] = currentCell;

  if (editor.selection.focus.offset === 0 && Path.equals(path, editor.selection.focus.path)) {
    event.preventDefault();
  }
};
