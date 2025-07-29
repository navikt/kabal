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
import { BoxNew, HGrid, HStack, Tooltip } from '@navikt/ds-react';
import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';
import { BaseBulletedListPlugin, BaseNumberedListPlugin } from '@platejs/list-classic';
import { TableAdd } from '@styled-icons/fluentui-system-regular';
import { BaseParagraphPlugin } from 'platejs';
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

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

  const maxRows = clamp(hoveredRow + 2, MIN_ROWS, MAX_ROWS);
  const maxColumns = clamp(hoveredColumn + 2, MIN_COLUMNS, MAX_COLUMNS);

  const isInGrid = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const gridRectRef = useRef<DOMRect | null>(null);

  useLayoutEffect(() => {
    if (gridRef.current !== null) {
      gridRectRef.current = gridRef.current.getBoundingClientRect();
    }
  }, []);

  const setCellFromMouse = useCallback((e: MouseEvent) => {
    if (gridRectRef.current === null) {
      return;
    }

    const { right, bottom, top, left } = gridRectRef.current;
    const maxBottom = top + MAX_BOTTOM;
    const maxRight = left + MAX_RIGHT;

    if (e.clientX > maxRight && e.clientY > maxBottom) {
      return setHoveredCell([MAX_ROWS, MAX_COLUMNS]);
    }

    if (e.clientX > right && e.clientY > bottom) {
      return setHoveredCell([
        e.clientY > maxBottom ? MAX_ROWS : Math.min(Math.round((e.clientY - top) / 26), MAX_ROWS),
        e.clientX > maxRight ? MAX_COLUMNS : Math.min(Math.round((e.clientX - left) / 26), MAX_COLUMNS),
      ]);
    }

    if (e.clientX > right) {
      return setHoveredCell(([row]) => [
        row,
        e.clientX > maxRight ? MAX_COLUMNS : Math.min(Math.round((e.clientX - left) / 26), MAX_COLUMNS),
      ]);
    }

    if (e.clientY > bottom) {
      return setHoveredCell(([, col]) => [
        e.clientY > maxBottom ? MAX_ROWS : Math.min(Math.round((e.clientY - top) / 26), MAX_ROWS),
        col,
      ]);
    }
  }, []);

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!isInGrid.current || gridRectRef.current === null) {
        return;
      }

      const { right, bottom, top, left } = gridRectRef.current;

      // If mouse is inside grid, do nothing.
      if (e.clientX >= left && e.clientX <= right && e.clientY >= top && e.clientY <= bottom) {
        isInGrid.current = true;
        return;
      }

      setCellFromMouse(e);
    };

    window.addEventListener('mousemove', listener);

    return () => {
      window.removeEventListener('mousemove', listener);
    };
  }, [setCellFromMouse]);

  return (
    <BoxNew
      position="absolute"
      background="default"
      borderWidth="1"
      borderColor="neutral"
      borderRadius="medium"
      shadow="dialog"
      padding="2"
      className="-left-28"
    >
      <BoxNew
        ref={gridRef}
        style={{
          width: getWidth(maxColumns),
          height: getHeight(maxRows),
        }}
        overflow="hidden"
        position="relative"
        onMouseLeave={(e) => {
          setCellFromMouse(e.nativeEvent);
          setTimeout(() => {
            isInGrid.current = false;
          }, 100);
        }}
        onMouseEnter={() => {
          isInGrid.current = true;
        }}
      >
        <BoxNew
          position="absolute"
          top="0"
          left="0"
          overflow="hidden"
          style={{
            width: getWidth(hoveredColumn + 1),
            height: getHeight(hoveredRow + 1),
          }}
          role="presentation"
          aria-hidden
        >
          <BackgroundGrid />
        </BoxNew>

        <Grid close={close} onClick={onClick} onFocus={setHoveredCell} />
      </BoxNew>

      <HStack justify="end">
        <HGrid columns="min-content min-content" gap="0 2" className="font-bold text-small">
          <span>Rader:</span>
          <span>{hoveredRow === -1 ? '?' : hoveredRow + 1}</span>
          <span>Kolonner:</span>
          <span>{hoveredColumn === -1 ? '?' : hoveredColumn + 1}</span>
        </HGrid>
      </HStack>
    </BoxNew>
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
          <BoxNew
            as="button"
            type="button"
            borderWidth="1"
            borderColor="neutral"
            borderRadius="small"
            onClick={() => {
              onClick(row + 1, col + 1);
              close();
            }}
            onMouseEnter={() => onFocus([row, col])}
            onFocus={() => onFocus([row, col])}
            className={'h-6 w-6 cursor-pointer bg-transparent'}
          />
        </Tooltip>
      )),
    )}
  </HGrid>
));

const BackgroundGrid = memo(() => (
  <HGrid gap="05" width="max-content" overflow="hidden" className="z-0" columns={MAX_COLUMNS_COUNT}>
    {ROWS.map((row) =>
      COLUMNS.map((col) => <BoxNew key={`${row}-${col}`} background="accent-strong" className="h-6 w-6" />),
    )}
  </HGrid>
));

const MIN_COLUMNS = 4;
const MIN_ROWS = 4;
const MAX_COLUMNS_COUNT = 12;
const MAX_ROWS_COUNT = 16;
const COLUMNS = Array.from({ length: MAX_COLUMNS_COUNT }).map((_, i) => i);
const ROWS = Array.from({ length: MAX_ROWS_COUNT }).map((_, i) => i);

const MAX_COLUMNS = MAX_COLUMNS_COUNT - 1;
const MAX_ROWS = MAX_ROWS_COUNT - 1;

const getWidth = (columns: number) => columns * 24 + (columns - 1) * 2;
const getHeight = (rows: number) => rows * 24 + (rows - 1) * 2;

const MAX_BOTTOM = getHeight(MAX_ROWS_COUNT);
const MAX_RIGHT = getWidth(MAX_COLUMNS_COUNT);
