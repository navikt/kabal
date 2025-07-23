import { clamp } from '@app/functions/clamp';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { createTable } from '@app/plate/templates/helpers';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { useIsInTable } from '@app/plate/toolbar/use-is-in-table';
import {
  type BulletListElement,
  type H1Element,
  type H2Element,
  type H3Element,
  type NumberedListElement,
  type ParagraphElement,
  useMyPlateEditorRef,
} from '@app/plate/types';
import { isNodeEmpty, isOfElementTypesFn, nextPath } from '@app/plate/utils/queries';
import { Box, HGrid, HStack, Tooltip } from '@navikt/ds-react';
import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';
import { BaseBulletedListPlugin, BaseNumberedListPlugin } from '@platejs/list-classic';
import { TableAdd } from '@styled-icons/fluentui-system-regular';
import { BaseParagraphPlugin } from 'platejs';
import { memo, useCallback, useRef, useState } from 'react';

export const InsertTableButton = () => {
  const unchangeable = useIsUnchangeable();
  const inTable = useIsInTable();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const close = useCallback(() => setIsOpen(false), []);

  useOnClickOutside(ref, close);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div ref={ref} className="relative">
      <ToolbarIconButton
        label="Sett inn tabell"
        onClick={toggleOpen}
        icon={<TableAdd width={24} aria-hidden />}
        disabled={unchangeable || inTable}
        active={inTable}
      />

      {isOpen ? <TableGrid close={close} /> : null}
    </div>
  );
};

interface TableGridProps {
  close: () => void;
}

const TableGrid = ({ close }: TableGridProps) => {
  const editor = useMyPlateEditorRef();
  const [[hoveredRow, hoveredColumn], setHoveredCell] = useState<[number, number]>([-1, -1]);

  // Normal insertTable() leaves an empty paragraph above
  const onClick = useCallback(
    (rows: number, columns: number) => {
      const current = editor.api.node<
        ParagraphElement | H1Element | H2Element | H3Element | BulletListElement | NumberedListElement
      >({
        match: isOfElementTypesFn([
          BaseParagraphPlugin.node.type,
          BaseH1Plugin.key,
          BaseH2Plugin.key,
          BaseH3Plugin.key,
          BaseBulletedListPlugin.node.type,
          BaseNumberedListPlugin.node.type,
        ]),
      });

      editor.tf.insertNodes(createTable(rows, columns), {
        at: current !== undefined ? nextPath(current[1]) : undefined,
      });

      if (current !== undefined && isNodeEmpty(current[0])) {
        editor.tf.removeNodes({ at: current[1] });
      }
    },
    [editor],
  );

  const maxRows = clamp(hoveredRow + 2, MIN_ROWS, MAX_ROWS_COUNT);
  const maxColumns = clamp(hoveredColumn + 2, MIN_COLUMNS, MAX_COLUMNS_COUNT);

  return (
    <Box
      position="absolute"
      background="bg-default"
      borderWidth="1"
      borderColor="border-default"
      borderRadius="medium"
      shadow="medium"
      padding="2"
      className="-left-28"
    >
      <Box
        style={{
          width: `${maxColumns * 24 + (maxColumns - 1) * 2}px`,
          height: `${maxRows * 24 + (maxRows - 1) * 2}px`,
        }}
        overflow="hidden"
        position="relative"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          overflow="hidden"
          style={{
            width: `${(hoveredColumn + 1) * 24 + (hoveredColumn) * 2}px`,
            height: `${(hoveredRow + 1) * 24 + (hoveredRow) * 2}px`,
          }}
          role="presentation"
          aria-hidden
        >
          <BackgroundGrid />
        </Box>

        <Grid close={close} onClick={onClick} onFocus={setHoveredCell} />
      </Box>

      <HStack justify="end">
        <HGrid columns="min-content min-content" gap="0 2" className="font-bold text-small">
          <span>Rader:</span>
          <span>{hoveredRow === -1 ? '?' : hoveredRow + 1}</span>
          <span>Kolonner:</span>
          <span>{hoveredColumn === -1 ? '?' : hoveredColumn + 1}</span>
        </HGrid>
      </HStack>
    </Box>
  );
};

interface GridProps {
  close: () => void;
  onClick: (rows: number, columns: number) => void;
  onFocus: (cell: [number, number]) => void;
}

const Grid = memo(({ close, onClick, onFocus }: GridProps) => (
  <HGrid
    gap="05"
    width="max-content"
    overflow="hidden"
    columns={MAX_COLUMNS_COUNT}
    position="absolute"
    left="0"
    top="0"
  >
    {ROWS.map((row) =>
      COLUMNS.map((col) => (
        <Tooltip
          key={`${row}-${col}`}
          placement="top"
          content={`Sett inn tabell med ${row + 1} ${row > 0 ? 'rader' : 'rad'} og ${col + 1} ${col > 0 ? 'kolonner' : 'kolonne'}`}
          describesChild
        >
          <Box
            as="button"
            type="button"
            borderWidth="1"
            borderRadius="small"
            onClick={() => {
              onClick(row + 1, col + 1);
              close();
            }}
            onMouseEnter={() => onFocus([row, col])}
            onFocus={() => onFocus([row, col])}
            className={'w-6 h-6 cursor-pointer bg-transparent hover:bg-surface-action-subtle-hover'}
          />
        </Tooltip>
      )),
    )}
  </HGrid>
));

const BackgroundGrid = memo(() => (
  <HGrid gap="05" width="max-content" overflow="hidden" className="z-0" columns={MAX_COLUMNS_COUNT}>
    {ROWS.map((row) =>
      COLUMNS.map((col) => <Box key={`${row}-${col}`} className="w-6 h-6 bg-surface-action-subtle" />),
    )}
  </HGrid>
));

const MIN_COLUMNS = 4;
const MIN_ROWS = 4;
const MAX_COLUMNS_COUNT = 12;
const MAX_ROWS_COUNT = 16;
const COLUMNS = Array.from({ length: MAX_COLUMNS_COUNT }).map((_, i) => i);
const ROWS = Array.from({ length: MAX_ROWS_COUNT }).map((_, i) => i);
