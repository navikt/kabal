import { CommentsButton } from '@app/plate/toolbar/add-comment';
import { InsertPlaceholder } from '@app/plate/toolbar/insert-placeholder';
import { Marks } from '@app/plate/toolbar/marks';
import { ToolbarSeparator } from '@app/plate/toolbar/separator';
import { TableButtons } from '@app/plate/toolbar/table/table';
import { type TableElement, useMyPlateEditorRef, useMyPlateEditorState } from '@app/plate/types';
import { Box, HStack } from '@navikt/ds-react';
import { BaseTablePlugin } from '@udecode/plate-table';
import { useEffect, useState } from 'react';

interface Props {
  editorId: string;
  container: HTMLDivElement | null;
}

interface TableToolbarProps extends Props {
  children: React.ReactNode;
}

const TableToolbar = ({ editorId, container, children }: TableToolbarProps) => {
  const editor = useMyPlateEditorState(editorId);
  const tableEntry = editor.api.node<TableElement>({ match: { type: BaseTablePlugin.node.type } });
  const table = tableEntry?.[0] ?? null;

  const position = useTablePosition(table, container);

  if (position === null) {
    return null;
  }

  const isFocused = editor.api.isFocused();

  if (!isFocused) {
    return null;
  }

  const [top, left] = position;

  return (
    <HStack asChild align="center" position="absolute" style={{ top, left, zIndex: 21, willChange: 'left, top' }}>
      <Box as="section" shadow="medium" background="surface-default" padding="05">
        {children}
      </Box>
    </HStack>
  );
};

export const SaksbehandlerTableToolbar = (props: Props) => (
  <TableToolbar {...props}>
    <Marks />
    <ToolbarSeparator />
    <TableButtons />
    <ToolbarSeparator />
    <CommentsButton />
  </TableToolbar>
);

export const RedaktoerTableToolbar = (props: Props) => (
  <TableToolbar {...props}>
    <Marks />
    <ToolbarSeparator />
    <TableButtons />
    <ToolbarSeparator />
    <InsertPlaceholder />
  </TableToolbar>
);

const TABLE_TOOLBAR_OFFSET = 8;
const TABLE_TOOLBAR_HEIGHT = 36;

const OFFSET = TABLE_TOOLBAR_OFFSET + TABLE_TOOLBAR_HEIGHT;

const useTablePosition = (table: TableElement | null, container: HTMLDivElement | null) => {
  const editor = useMyPlateEditorRef();
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (container === null || table === null) {
      setPosition(null);

      return;
    }

    const handle = requestIdleCallback(
      () => {
        const domNode = editor.api.toDOMNode(table);

        if (domNode === undefined) {
          setPosition(null);

          return;
        }

        const tablePos = domNode.getBoundingClientRect();
        const containerPos = container.getBoundingClientRect();

        const top = tablePos.top - containerPos.top - OFFSET;
        const left = tablePos.left - containerPos.left;

        setPosition([top, left]);
      },
      { timeout: 100 },
    );

    return () => cancelIdleCallback(handle);
  }, [container, editor, table]);

  return position;
};
