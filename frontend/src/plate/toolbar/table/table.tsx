import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import { ToolbarSeparator } from '@app/plate/toolbar/separator';
import { AddColumnLeftIcon } from '@app/plate/toolbar/table/icons/add-column-left';
import { AddColumnRightIcon } from '@app/plate/toolbar/table/icons/add-column-right';
import { AddRowAboveIcon } from '@app/plate/toolbar/table/icons/add-row-above';
import { AddRowBelowIcon } from '@app/plate/toolbar/table/icons/add-row-below';
import { DeleteColumnIcon } from '@app/plate/toolbar/table/icons/delete-column';
import { DeleteRowIcon } from '@app/plate/toolbar/table/icons/delete-row';
import { MergeCellsIcon } from '@app/plate/toolbar/table/icons/merge-cells';
import { mergeCells } from '@app/plate/toolbar/table/merge-cells';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { type TableCellElement, useMyPlateEditorRef } from '@app/plate/types';
import { isOfElementTypeFn, nextPath } from '@app/plate/utils/queries';
import { TrashIcon } from '@navikt/aksel-icons';
import { TextAddSpaceAfter, TextAddSpaceBefore } from '@styled-icons/fluentui-system-regular';
import {
  findNode,
  insertElements,
  isElement,
  select,
  withoutNormalizing,
  withoutSavingHistory,
} from '@udecode/plate-common';
import {
  BaseTableCellPlugin,
  BaseTablePlugin,
  BaseTableRowPlugin,
  deleteTable,
  insertTableColumn,
  insertTableRow,
} from '@udecode/plate-table';
import { deleteColumn, deleteRow } from '@udecode/plate-table';

export const TableButtons = () => {
  const editor = useMyPlateEditorRef();
  const unchangeable = useIsUnchangeable();

  if (unchangeable) {
    return null;
  }

  const activeNode = findNode(editor, { match: (n) => isElement(n) && n.type === BaseTablePlugin.node.type });

  if (activeNode === undefined) {
    return null;
  }

  return (
    <>
      <ToolbarIconButton
        label="Legg til rad over"
        onClick={() => {
          const activeRow = findNode(editor, { match: (n) => isElement(n) && n.type === BaseTableRowPlugin.node.type });

          if (activeRow === undefined) {
            return;
          }

          insertTableRow(editor, { at: activeRow[1], disableSelect: true });
        }}
        icon={<AddRowAboveIcon aria-hidden />}
      />
      <ToolbarIconButton
        label="Legg til rad under"
        onClick={() => insertTableRow(editor)}
        icon={<AddRowBelowIcon aria-hidden />}
      />

      <ToolbarIconButton
        label="Legg til kolonne til venstre"
        onClick={() => {
          const activeTd = findNode(editor, { match: (n) => isElement(n) && n.type === BaseTableCellPlugin.node.type });

          if (activeTd === undefined) {
            return;
          }

          insertTableColumn(editor, { at: activeTd[1], disableSelect: true });
        }}
        icon={<AddColumnLeftIcon aria-hidden />}
      />

      <ToolbarIconButton
        label="Legg til kolonne til høyre"
        onClick={() => insertTableColumn(editor)}
        icon={<AddColumnRightIcon aria-hidden />}
      />

      <ToolbarIconButton label="Fjern rad" onClick={() => deleteRow(editor)} icon={<DeleteRowIcon aria-hidden />} />

      <ToolbarIconButton
        label="Fjern kolonne"
        onClick={() => deleteColumn(editor)}
        icon={<DeleteColumnIcon aria-hidden />}
      />

      <ToolbarIconButton
        label="Slå sammen med celle til høyre"
        onClick={() => {
          const entry = findNode<TableCellElement>(editor, {
            match: (n) => isElement(n) && n.type === BaseTableCellPlugin.node.type,
          });

          if (entry === undefined) {
            return;
          }

          mergeCells(editor, entry[0]);
        }}
        icon={<MergeCellsIcon aria-hidden />}
      />

      <ToolbarSeparator />

      <ToolbarIconButton
        label="Legg til nytt avsnitt over"
        onClick={() => {
          const entry = findNode(editor, { match: isOfElementTypeFn(BaseTablePlugin.node.type) });

          if (entry === undefined) {
            return;
          }

          insertElements(editor, createSimpleParagraph(), { at: entry[1] });
        }}
        icon={<TextAddSpaceBefore width={24} aria-hidden />}
      />

      <ToolbarIconButton
        label="Legg til nytt avsnitt under"
        onClick={() => {
          const entry = findNode(editor, { match: isOfElementTypeFn(BaseTablePlugin.node.type) });

          if (entry === undefined) {
            return;
          }

          insertElements(editor, createSimpleParagraph(), { at: nextPath(entry[1]) });
        }}
        icon={<TextAddSpaceAfter width={24} aria-hidden />}
      />

      <ToolbarSeparator />

      <ToolbarIconButton
        label="Slett tabell"
        onClick={() => {
          const entry = findNode(editor, { match: isOfElementTypeFn(BaseTablePlugin.node.type) });

          if (entry === undefined) {
            return;
          }

          withoutNormalizing(editor, () => {
            const [, path] = entry;
            withoutSavingHistory(editor, () => {
              insertElements(editor, createSimpleParagraph(), { at: path });
            });
            deleteTable(editor);
            select(editor, path);
          });
        }}
        icon={<TrashIcon aria-hidden />}
      />
    </>
  );
};
