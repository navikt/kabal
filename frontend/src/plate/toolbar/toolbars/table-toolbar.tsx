import { Box, HStack } from '@navikt/ds-react';
import { BaseTablePlugin } from '@platejs/table';
import { useEventEditorValue } from 'platejs/react';
import { useContext, useEffect, useState } from 'react';
import { ScaleContext } from '@/plate/status-bar/scale-context';
import { CommentsButton } from '@/plate/toolbar/add-comment';
import { InsertPlaceholder } from '@/plate/toolbar/insert-placeholder';
import { Marks } from '@/plate/toolbar/marks';
import { ToolbarSeparator } from '@/plate/toolbar/separator';
import { TableButtons } from '@/plate/toolbar/table/table';
import { type TableElement, useMyPlateEditorState } from '@/plate/types';

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

  const focusedEditorId = useEventEditorValue('focus');
  const isFocused = editorId === focusedEditorId;

  if (position === null) {
    return null;
  }

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
      <Box as="section" shadow="dialog" background="default" padding="space-2">
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
  const [position, setPosition] = useState<[number, number] | null>(null);
  const { scale } = useContext(ScaleContext);

  useEffect(() => {
    if (container === null || table === null) {
      setPosition(null);

      return;
    }

    const handle = requestIdleCallback(
      () => {
        const { id } = table;

        if (id === undefined) {
          setPosition(null);

          return;
        }

        const domNode = document.getElementById(id);

        if (domNode === null) {
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
  }, [container, table, scale]);

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
