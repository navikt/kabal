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
import { getDefaultColSizes } from '@app/plate/toolbar/table/with-overrides';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { type TableElement, useMyPlateEditorState } from '@app/plate/types';
import { isOfElementTypeFn, nextPath } from '@app/plate/utils/queries';
import { SpaceHorizontalIcon, TrashIcon } from '@navikt/aksel-icons';
import {
  BaseTableCellPlugin,
  BaseTablePlugin,
  deleteTable,
  getTableGridAbove,
  isTableRectangular,
} from '@platejs/table';
import { TablePlugin, TableProvider } from '@platejs/table/react';
import { TextAddSpaceAfter, TextAddSpaceBefore } from '@styled-icons/fluentui-system-regular';
import { ElementApi } from 'platejs';
import { useEditorPlugin, useEditorSelector, usePluginOption, useReadOnly, withHOC } from 'platejs/react';
import { MAX_TABLE_WIDTH } from './constants';

export const TableButtons = withHOC(TableProvider, () => {
  const { tf } = useEditorPlugin(TablePlugin);

  const editor = useMyPlateEditorState();

  const unchangeable = useIsUnchangeable();
  const { canMerge, canSplit } = useTableMergeState();

  if (unchangeable) {
    return null;
  }

  const activeNode = editor.api.node({ match: (n) => ElementApi.isElement(n) && n.type === BaseTablePlugin.node.type });

  if (activeNode === undefined) {
    return null;
  }

  const insertColumn = (before: boolean) => () => {
    editor.tf.withoutNormalizing(() => {
      const tableCellEntry = editor.api.node({ match: { type: BaseTableCellPlugin.node.type } });

      if (tableCellEntry === undefined) {
        return;
      }

      const [, path] = tableCellEntry;

      const colNum = path.at(-1);

      if (colNum === undefined) {
        return;
      }

      tf.insert.tableColumn({ before, select: true });

      const tableEntry = editor.api.node<TableElement>({ match: { type: BaseTablePlugin.node.type } });

      if (tableEntry === undefined) {
        return;
      }

      const [tableNode, tablePath] = tableEntry;

      if (tableNode.colSizes === undefined) {
        return;
      }

      const colSizes = tableNode.colSizes ?? getDefaultColSizes(tableNode);

      const newColSizes = adjustColSizes(colSizes, colNum, before);

      editor.tf.setNodes({ colSizes: newColSizes }, { at: tablePath });
    });
  };

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
        onClick={insertColumn(true)}
        onMouseDown={(e) => e.preventDefault()}
        icon={<AddColumnLeftIcon aria-hidden />}
      />

      <ToolbarIconButton
        label="Legg til kolonne til høyre"
        onClick={insertColumn(false)}
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

      <ToolbarIconButton
        label="Gjør alle kolonner like brede"
        onClick={() => {
          const tableEntry = editor.api.node<TableElement>({ match: { type: BaseTablePlugin.node.type } });

          if (tableEntry === undefined) {
            return;
          }

          const [tableNode, tablePath] = tableEntry;

          if (tableNode.colSizes === undefined) {
            return;
          }

          const colSizes = getDefaultColSizes(tableNode);

          editor.tf.setNodes({ colSizes }, { at: tablePath });
        }}
        onMouseDown={(e) => e.preventDefault()}
        icon={<SpaceHorizontalIcon aria-hidden />}
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
  const selectedTables = usePluginOption(TablePlugin, 'selectedTables');
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

/**
 *
 * @param colSizes - Col sizes with the new column (temporarily) inserted with size 0
 * @param colNum - Index of column we inserted from, NOT index of the new column
 * @param before - Whether the new column was inserted before or after the given index
 * @param maxWidth - Maximum width of the table (only set explicitly in tests for easier math)
 * @returns - Adjusted column sizes
 */
export const adjustColSizes = (colSizes: number[], colNum: number, before: boolean, maxWidth = MAX_TABLE_WIDTH) => {
  const colSizesWithoutNewCol = colSizes.filter((_, i) => i !== colNum + (before ? 0 : 1));

  const totalWidth = colSizesWithoutNewCol.reduce((a, b) => a + b, 0);
  const availableWidth = maxWidth - totalWidth;
  const neighbourColSize = colSizesWithoutNewCol[colNum];

  if (neighbourColSize === undefined) {
    return colSizes;
  }

  const spacedEvenly = colSizesWithoutNewCol.every((s) => s === neighbourColSize);

  // Space all columns evenly if they were evenly spaced before
  if (spacedEvenly) {
    if (availableWidth >= neighbourColSize) {
      return Array.from({ length: colSizes.length }, () => neighbourColSize);
    }

    return Array.from({ length: colSizes.length }, () => Math.floor(maxWidth / colSizes.length));
  }

  // Add new column with same width as neighbour column if there is space
  if (neighbourColSize < availableWidth) {
    return [...colSizesWithoutNewCol.slice(0, colNum), neighbourColSize, ...colSizesWithoutNewCol.slice(colNum)];
  }

  const colSize = Math.floor((availableWidth + neighbourColSize) / 2);

  // If there is not enough space to copy from neighbour column,
  // use half of the available space for both the neighbour and the new column
  return [...colSizesWithoutNewCol.slice(0, colNum), colSize, colSize, ...colSizesWithoutNewCol.slice(colNum + 1)];
};
