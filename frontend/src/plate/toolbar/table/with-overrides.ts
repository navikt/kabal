import { MAX_TABLE_WIDTH } from '@app/plate/toolbar/table/constants';
import type { TableElement } from '@app/plate/types';
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
      const colSizes = Array.isArray(node.colSizes) ? getAdjustedColSizes(node.colSizes) : getDefaultColSizes(node);

      editor.tf.setNodes({ colSizes }, { at: path });
    }

    return normalizeNode(entry, options);
  };

  editor.api.html.deserialize = (args): Descendant[] =>
    deserialize(args).map((node) => {
      if (isOfElementType<TableElement>(node, BaseTablePlugin.node.type)) {
        node.colSizes = getDefaultColSizes(node);
      }

      return node;
    });

  return editor;
};

export const getDefaultColSizes = (table: TableElement): number[] => {
  // Find the row with highest number of cells
  const numCols = table.children.reduce((max, { children }) => (children.length > max ? children.length : max), 0);

  // Let the table be full width with equal column sizes
  return Array.from({ length: numCols }, () => Math.floor(MAX_TABLE_WIDTH / numCols));
};

const isValidColSizes = (colSizes: number[] | undefined): boolean => {
  if (!Array.isArray(colSizes)) {
    return false;
  }

  if (colSizes.some((size) => size <= 0)) {
    return false;
  }

  const totalWidth = colSizes.reduce((a, b) => a + b);

  return totalWidth <= MAX_TABLE_WIDTH;
};

const DEFAULT_COL_SIZE = 100;

const getAdjustedColSizes = (colSizes: number[]): number[] => {
  const nonZeroColSizes = colSizes.map((size) => (size <= 0 ? DEFAULT_COL_SIZE : size));

  const totalWidth = nonZeroColSizes.reduce((a, b) => a + b, 0);

  if (totalWidth <= MAX_TABLE_WIDTH) {
    return nonZeroColSizes;
  }

  const toShrink = totalWidth - MAX_TABLE_WIDTH;

  const shinkagePercentage = toShrink / totalWidth;

  return nonZeroColSizes.map((size) => Math.floor(size - size * shinkagePercentage));
};
