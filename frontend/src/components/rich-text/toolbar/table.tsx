import { TableAdd } from '@styled-icons/fluentui-system-regular/TableAdd';
import React from 'react';
import { useSlateStatic } from 'slate-react';
import { isBlockActive } from '../functions/blocks';
import { canInsertTable, insertTable } from '../functions/table/insert-table';
import { TableTypeEnum } from '../types/editor-enums';
import { ToolbarIconButton } from './toolbarbutton';

export const TableButton = () => {
  const editor = useSlateStatic();

  const onClick = () => insertTable(editor);

  const isActive = isBlockActive(editor, TableTypeEnum.TABLE);

  return (
    <ToolbarIconButton
      label="Sett inn tabell (Ctrl/⌘ + M)"
      active={isActive}
      onClick={onClick}
      disabled={isActive || !canInsertTable(editor)}
      icon={<TableAdd height={24} />}
    />
  );
};
