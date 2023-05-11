import { TrashIcon } from '@navikt/aksel-icons';
import {
  TableDeleteColumn,
  TableDeleteRow,
  TableInsertColumn,
  TableInsertRow,
} from '@styled-icons/fluentui-system-regular';
import {
  ELEMENT_TABLE,
  ELEMENT_TR,
  deleteColumn,
  deleteRow,
  deleteTable,
  findNode,
  getTableRowIndex,
  insertTableColumn,
  insertTableRow,
  isElement,
  usePlateSelection,
} from '@udecode/plate';
import React from 'react';
import { Path } from 'slate';
import { ToolbarIconButton } from '@app/components/plate-editor/toolbar/toolbarbutton';
import { EditorDescendant, EditorValue, useMyPlateEditorRef } from '@app/components/plate-editor/types';

export const Table = () => {
  const editor = useMyPlateEditorRef();
  const at = usePlateSelection();

  console.log('selection', at);

  if (at === null) {
    return null;
  }
  const activeNode = findNode<EditorDescendant>(editor, { at, match: (n) => isElement(n) && n.type === ELEMENT_TABLE });

  console.log('activeNode', activeNode);

  if (activeNode === undefined) {
    return null;
  }

  return (
    <>
      <ToolbarIconButton
        label="Legg til rad over"
        onClick={() => {
          if (at === null) {
            return;
          }

          const activeRow = findNode<EditorDescendant>(editor, {
            at,
            match: (n) => isElement(n) && n.type === ELEMENT_TR,
          });

          console.log('activeRow', activeRow);

          if (activeRow === undefined) {
            return;
          }
          console.log(Path.previous(activeRow[1]));

          insertTableRow<EditorValue>(editor, { at: activeRow[1] });
        }}
        icon={<TableInsertRow height={ICON_SIZE} />}
        active={false}
      />
      <ToolbarIconButton
        label="Legg til rad under"
        onClick={() => insertTableRow<EditorValue>(editor)}
        icon={<TableInsertRow height={ICON_SIZE} />}
        active={false}
      />
      <ToolbarIconButton
        label="Legg til kolonne"
        onClick={() => insertTableColumn<EditorValue>(editor)}
        icon={<TableInsertColumn height={ICON_SIZE} />}
        active={false}
      />

      <ToolbarIconButton
        label="Fjern rad"
        onClick={() => deleteRow<EditorValue>(editor)}
        icon={<TableDeleteRow height={ICON_SIZE} />}
        active={false}
      />
      <ToolbarIconButton
        label="Fjern kolonne"
        onClick={() => deleteColumn<EditorValue>(editor)}
        icon={<TableDeleteColumn height={ICON_SIZE} />}
        active={false}
      />

      <ToolbarIconButton
        label="Slett tabell"
        onClick={() => deleteTable<EditorValue>(editor)}
        icon={<TrashIcon height={ICON_SIZE} />}
        active={false}
      />
    </>
  );
};

const ICON_SIZE = 24;
