import { ScaleContext } from '@app/plate/status-bar/scale-context';
import { CommentsButton } from '@app/plate/toolbar/add-comment';
import { InsertPlaceholder } from '@app/plate/toolbar/insert-placeholder';
import { Marks } from '@app/plate/toolbar/marks';
import { ToolbarSeparator } from '@app/plate/toolbar/separator';
import { TableButtons } from '@app/plate/toolbar/table/table';
import { type TableElement, useMyPlateEditorRef, useMyPlateEditorState } from '@app/plate/types';
import { Box, HStack } from '@navikt/ds-react';
import { BaseTablePlugin } from '@platejs/table';
import { useContext, useEffect, useState } from 'react';

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
    <HStack
      asChild
      align="center"
      position="absolute"
      className="z-21"
      style={{ top, left, willChange: 'left, top' }}
      wrap={false}
    >
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

const PADDING = 2;
const ROW_HEIGHT = 32;
const TABLE_TOOLBAR_OFFSET = 8;

const useTablePosition = (table: TableElement | null, container: HTMLDivElement | null) => {
  const editor = useMyPlateEditorRef();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const { scale } = useContext(ScaleContext);

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

        const rows = scaleToNumberOfToolbarRows(scale);
        const toolbarHeight = ROW_HEIGHT * rows + PADDING * 2;

        const top = tablePos.top - containerPos.top - toolbarHeight - TABLE_TOOLBAR_OFFSET;
        const left = tablePos.left - containerPos.left;

        setPosition([top, left]);
      },
      { timeout: 100 },
    );

    return () => cancelIdleCallback(handle);
  }, [container, editor, table, scale]);

  return position;
};

const scaleToNumberOfToolbarRows = (scale: number) => {
  if (scale > 76) {
    return 1;
  }

  if (scale > 39) {
    return 2;
  }

  return 3;
};
