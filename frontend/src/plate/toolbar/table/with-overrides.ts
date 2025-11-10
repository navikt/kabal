import { MAX_TABLE_WIDTH } from '@app/plate/toolbar/table/constants';
import type { TableElement, TableRowElement } from '@app/plate/types';
import { isOfElementType } from '@app/plate/utils/queries';
import type { OverrideEditor } from '@platejs/core/react';
import { BaseTablePlugin, type TableConfig } from '@platejs/table';
import type { Descendant } from 'platejs';

export const withOverrides: OverrideEditor<TableConfig> = ({ editor }) => {
  const {
    html: { deserialize },
  } = editor.api;

  const { normalizeNode } = editor.tf;

  editor.tf.normalizeNode = (entry, options) => {
    const [node, path] = entry;

    if (isOfElementType<TableElement>(node, BaseTablePlugin.node.type) && !isValidColSizes(node.colSizes)) {
      const colSizes = Array.isArray(node.colSizes)
        ? getAdjustedColSizes(node.colSizes, node)
        : getDefaultColSizes(node);

      editor.tf.setNodes({ colSizes }, { at: path });
    }

    return normalizeNode(entry, options);
  };

  editor.api.html.deserialize = (args): Descendant[] =>
    deserialize(args).map((node) => {
      if (isOfElementType<TableElement>(node, BaseTablePlugin.node.type)) {
        return {
          ...node,
          children: adjustSpans(node),
          colSizes: getDefaultColSizes(node),
        };
      }

      return node;
    });

  return editor;
};

export const getDefaultColSizes = (table: TableElement): number[] => {
  // Find the row with highest number of cells
  const numCols = getNumCols(table);

  // Let the table be full width with equal column sizes
  return Array.from({ length: numCols }, () => Math.floor(MAX_TABLE_WIDTH / numCols));
};

const isValidColSizes = (colSizes: number[] | undefined): boolean => {
  if (!Array.isArray(colSizes)) {
    return false;
  }

  if (colSizes.some((size) => Number.isNaN(size) || size <= 0)) {
    return false;
  }

  const totalWidth = colSizes.reduce((a, b) => a + b);

  return totalWidth <= MAX_TABLE_WIDTH;
};

const DEFAULT_COL_SIZE = 100;

const getAdjustedColSizes = (colSizes: number[], table: TableElement): number[] => {
  // colSizes.length can theoretically be larger than number of columns
  const slicedCols = colSizes.slice(0, getNumCols(table));

  const nonZeroColSizes = slicedCols.map((size) => (Number.isNaN(size) || size <= 0 ? DEFAULT_COL_SIZE : size));

  const totalWidth = nonZeroColSizes.reduce((a, b) => a + b, 0);

  if (totalWidth <= MAX_TABLE_WIDTH) {
    return nonZeroColSizes;
  }

  const toShrink = totalWidth - MAX_TABLE_WIDTH;

  const shinkagePercentage = toShrink / totalWidth;

  return nonZeroColSizes.map((size) => Math.floor(size - size * shinkagePercentage));
};

const getNumCols = (table: TableElement): number =>
  table.children.reduce((max, { children }) => (children.length > max ? children.length : max), 0);

const adjustSpans = (table: TableElement): TableRowElement[] => {
  const maxCols = getNumCols(table);

  return table.children.map((row) => {
    const adjustedSpans = getAdjustedSpans(
      row.children.map((cell) => cell.colSpan ?? 1),
      maxCols,
    );

    return {
      ...row,
      children: row.children.map((cell, i) => ({
        ...cell,
        attributes: {
          ...cell.attributes,
          colspan: adjustedSpans[i]?.toString(),
        },
      })),
    };
  });
};

export const getAdjustedSpans = (originalSpans: number[], maxCols: number): number[] => {
  const totalSpan = originalSpans.reduce((acc, span) => acc + span, 0);

  if (totalSpan === maxCols) {
    return originalSpans;
  }

  if (originalSpans.length === maxCols) {
    return Array.from(originalSpans).fill(1);
  }

  const toShrink = totalSpan - maxCols;

  const shrinkagePercentage = toShrink / totalSpan;

  const newSpans = originalSpans.map((span) => (span === 1 ? 1 : Math.floor(span - span * shrinkagePercentage)));

  const currentTotal = newSpans.reduce((acc, span) => acc + span, 0);

  if (maxCols > currentTotal) {
    const last = newSpans.at(-1);

    if (last === undefined) {
      return newSpans;
    }

    const adjustment = maxCols - currentTotal;

    return [...newSpans.slice(0, -1), last + adjustment];
  }

  if (currentTotal > maxCols) {
    const sorted = newSpans.map((span, i) => ({ span, i })).toSorted((a, b) => b.span - a.span);

    const adjustment = currentTotal - maxCols;

    for (let j = 0; j < Math.min(adjustment, sorted.length); j++) {
      const item = sorted[j];

      if (item === undefined) {
        break;
      }

      const current = newSpans[item.i];

      if (item.span > 1 && current !== undefined) {
        newSpans[item.i] = current - 1;
      }
    }
  }

  return newSpans;
};
