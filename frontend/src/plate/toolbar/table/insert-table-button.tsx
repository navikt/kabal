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
import { BodyShort } from '@navikt/ds-react';
import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';
import { BaseBulletedListPlugin, BaseNumberedListPlugin } from '@platejs/list-classic';
import { TableAdd } from '@styled-icons/fluentui-system-regular';
import { BaseParagraphPlugin } from 'platejs';
import { useRef, useState } from 'react';

export const InsertTableButton = () => {
  const unchangeable = useIsUnchangeable();
  const inTable = useIsInTable();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const close = () => setIsOpen(false);

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

const TableGrid = ({ close }: { close: () => void }) => {
  const editor = useMyPlateEditorRef();
  const [hoveredCell, setHoveredCell] = useState<[number, number]>([-1, -1]);

  // Normal insertTable() leaves an empty paragraph above
  const onClick = (rows: number, columns: number) => {
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

    editor.tf.insertNodes(createTable(rows, columns), { at: current !== undefined ? nextPath(current[1]) : undefined });

    if (current !== undefined && isNodeEmpty(current[0])) {
      editor.tf.removeNodes({ at: current[1] });
    }
  };

  return (
    <div className="absolute right-0 bg-surface-default border border-border-default rounded-md p-2">
      <BodyShort size="small" spacing>
        <b>
          {hoveredCell[0] === -1 || hoveredCell[1] === -1
            ? 'Velg antall rader og kolonner'
            : `${hoveredCell[0] + 1} ${hoveredCell[0] > 0 ? 'rader' : 'rad'}, ${hoveredCell[1] + 1} ${hoveredCell[1] > 0 ? 'kolonner' : 'kolonne'}`}
        </b>
      </BodyShort>

      {SIXTEEN.map((row) => (
        <div key={row} className="flex gap-1 mb-1 last:mb-0">
          {TWELVE.map((col) => (
            <button
              key={col}
              type="button"
              onClick={() => {
                onClick(row + 1, col + 1);
                close();
              }}
              onMouseEnter={() => setHoveredCell([row, col])}
              title={`Sett inn tabell med ${row + 1} ${row > 0 ? 'rader' : 'rad'} og ${col + 1} ${col > 0 ? 'kolonner' : 'kolonne'}`}
              className={
                'w-6 h-6 border border-gray-300 cursor-pointer' +
                (hoveredCell[0] >= row && hoveredCell[1] >= col ? ' bg-surface-action' : '')
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const TWELVE = Array.from({ length: 12 }).map((_, i) => i);
const SIXTEEN = Array.from({ length: 16 }).map((_, i) => i);
