import { Editor, Path } from 'slate';
import { TableCellElementType } from '../../types/editor-types';

export type TableFn<R = Path> = (editor: Editor, cell: TableCellElementType, cellPath?: Path) => R;
