import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { useSelection } from '@app/plate/hooks/use-selection';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import { ToolbarSeparator } from '@app/plate/toolbar/separator';
import { AddColumnLeftIcon } from '@app/plate/toolbar/table/icons/add-column-left';
import { AddColumnRightIcon } from '@app/plate/toolbar/table/icons/add-column-right';
import { AddRowAboveIcon } from '@app/plate/toolbar/table/icons/add-row-above';
import { AddRowBelowIcon } from '@app/plate/toolbar/table/icons/add-row-below';
import { DeleteColumnIcon } from '@app/plate/toolbar/table/icons/delete-column';
import { DeleteRowIcon } from '@app/plate/toolbar/table/icons/delete-row';
import { MergeCellsIcon } from '@app/plate/toolbar/table/icons/merge-cells';
import { SplitCellsIcon } from '@app/plate/toolbar/table/icons/split-cells';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { useMyPlateEditorRef } from '@app/plate/types';
import { isOfElementTypeFn, nextPath } from '@app/plate/utils/queries';
import { TrashIcon } from '@navikt/aksel-icons';
import { TextAddSpaceAfter, TextAddSpaceBefore } from '@styled-icons/fluentui-system-regular';
import { ElementApi } from '@udecode/plate';
import { BaseTablePlugin, deleteTable, getTableGridAbove, isTableRectangular } from '@udecode/plate-table';
import { TablePlugin, TableProvider, useTableStore } from '@udecode/plate-table/react';
import { useEditorPlugin, useEditorSelector, useReadOnly, withHOC } from '@udecode/plate/react';

export const TableButtons = withHOC(TableProvider, () => {
  const { tf } = useEditorPlugin(TablePlugin);

  const editor = useMyPlateEditorRef();
  const unchangeable = useIsUnchangeable();
  const { canMerge, canSplit } = useTableMergeState();

  if (unchangeable) {
    return null;
  }

  const activeNode = editor.api.node({ match: (n) => ElementApi.isElement(n) && n.type === BaseTablePlugin.node.type });

  if (activeNode === undefined) {
    return null;
  }

  return (
    <>
      <ToolbarIconButton
        label="Legg til rad over"
        onClick={() => tf.insert.tableRow({ before: true })}
        onMouseDown={(e) => e.preventDefault()}
        icon={<AddRowAboveIcon aria-hidden />}
      />
      <ToolbarIconButton
        label="Legg til rad under"
        onClick={() => tf.insert.tableRow({ before: false })}
        onMouseDown={(e) => e.preventDefault()}
        icon={<AddRowBelowIcon aria-hidden />}
      />

      <ToolbarIconButton
        label="Legg til kolonne til venstre"
        onClick={() => tf.insert.tableColumn({ before: true })}
        onMouseDown={(e) => e.preventDefault()}
        icon={<AddColumnLeftIcon aria-hidden />}
      />

      <ToolbarIconButton
        label="Legg til kolonne til høyre"
        onClick={() => tf.insert.tableColumn({ before: false })}
        onMouseDown={(e) => e.preventDefault()}
        icon={<AddColumnRightIcon aria-hidden />}
      />

      <ToolbarIconButton
        label="Fjern rad"
        onClick={tf.remove.tableRow}
        onMouseDown={(e) => e.preventDefault()}
        icon={<DeleteRowIcon aria-hidden />}
      />

      <ToolbarIconButton
        label="Fjern kolonne"
        onClick={tf.remove.tableColumn}
        onMouseDown={(e) => e.preventDefault()}
        icon={<DeleteColumnIcon aria-hidden />}
      />

      <ToolbarIconButton
        label="Slå sammen markerte celler"
        onClick={tf.table.merge}
        onMouseDown={(e) => e.preventDefault()}
        icon={<MergeCellsIcon aria-hidden />}
        disabled={!canMerge}
      />

      <ToolbarIconButton
        label="Splitt celle"
        onClick={tf.table.split}
        onMouseDown={(e) => e.preventDefault()}
        icon={<SplitCellsIcon aria-hidden />}
        disabled={!canSplit}
      />

      <ToolbarSeparator />

      <ToolbarIconButton
        label="Legg til nytt avsnitt over"
        onClick={() => {
          const entry = editor.api.node({ match: isOfElementTypeFn(BaseTablePlugin.node.type) });

          if (entry === undefined) {
            return;
          }

          editor.tf.insertNodes(createSimpleParagraph(), { at: entry[1] });
        }}
        icon={<TextAddSpaceBefore width={24} aria-hidden />}
      />

      <ToolbarIconButton
        label="Legg til nytt avsnitt under"
        onClick={() => {
          const entry = editor.api.node({ match: isOfElementTypeFn(BaseTablePlugin.node.type) });

          if (entry === undefined) {
            return;
          }

          editor.tf.insertNodes(createSimpleParagraph(), { at: nextPath(entry[1]) });
        }}
        icon={<TextAddSpaceAfter width={24} aria-hidden />}
      />

      <ToolbarSeparator />

      <ToolbarIconButton
        label="Slett tabell"
        onClick={() => {
          const entry = editor.api.node({ match: isOfElementTypeFn(BaseTablePlugin.node.type) });

          if (entry === undefined) {
            return;
          }

          editor.tf.withoutNormalizing(() => {
            const [, path] = entry;
            editor.tf.withoutSaving(() => {
              editor.tf.insertNodes(createSimpleParagraph(), { at: path });
            });
            deleteTable(editor);
            editor.tf.select(path);
          });
        }}
        icon={<TrashIcon aria-hidden />}
      />
    </>
  );
});

// Copy-paste from plate/packages/table/src/react/hooks/useTableMergeState.ts (v. 43.0.3) with useSelected fix
// useSelected doesn't seem to work
export const useTableMergeState = () => {
  const { api, getOptions } = useEditorPlugin(TablePlugin);

  const { disableMerge } = getOptions();
  const readOnly = useReadOnly();

  // const selected = useSelected();
  const selected = useSelection() !== null;

  const selectionExpanded = useEditorSelector((editor) => editor.api.isExpanded(), []);

  const collapsed = !readOnly && selected && !selectionExpanded;
  const selectedTables = useTableStore().get.selectedTables();
  const selectedTable = selectedTables?.[0];

  const selectedCellEntries = useEditorSelector((editor) => getTableGridAbove(editor, { format: 'cell' }), []);

  if (disableMerge) {
    return { canMerge: false, canSplit: false };
  }

  if (!selectedCellEntries) {
    return { canMerge: false, canSplit: false };
  }

  const canMerge =
    !readOnly && selected && selectionExpanded && selectedCellEntries.length > 1 && isTableRectangular(selectedTable);

  const firstCellEtnry = selectedCellEntries[0]?.[0];

  const canSplit =
    collapsed &&
    selectedCellEntries.length === 1 &&
    firstCellEtnry !== undefined &&
    (api.table.getColSpan(firstCellEtnry) > 1 || api.table.getRowSpan(firstCellEtnry) > 1);

  return { canMerge, canSplit };
};
