import type { TableElement } from '@app/plate/types';
import { isOfElementType } from '@app/plate/utils/queries';
import type { OverrideEditor } from '@platejs/core/react';
import { BaseTablePlugin, type TableConfig } from '@platejs/table';
import type { Descendant } from 'platejs';

export const withOverrides: OverrideEditor<TableConfig> = ({ editor }) => {
  const {
    html: { deserialize },
  } = editor.api;

  editor.api.html.deserialize = (args): Descendant[] =>
    deserialize(args).map((node) => {
      if (isOfElementType<TableElement>(node, BaseTablePlugin.node.type)) {
        // Find the row with highest number of cells
        const numCols = node.children.reduce((max, { children }) => (children.length > max ? children.length : max), 0);

        // Let the table be full width with equal column sizes
        node.colSizes = Array.from({ length: numCols }, () => Math.floor(MAX_WIDTH / numCols));
      }

      return node;
    });

  return editor;
};

export const MAX_WIDTH = 642;
export const DEFAULT_COL_SIZE = 50;
