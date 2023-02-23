import { Close, Delete } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import { TableCellsMerge } from '@styled-icons/fluentui-system-regular/TableCellsMerge';
import { TableCellsSplit } from '@styled-icons/fluentui-system-regular/TableCellsSplit';
import { TableDeleteColumn } from '@styled-icons/fluentui-system-regular/TableDeleteColumn';
import { TableDeleteRow } from '@styled-icons/fluentui-system-regular/TableDeleteRow';
import { TableDismiss } from '@styled-icons/fluentui-system-regular/TableDismiss';
import { TableInsertColumn } from '@styled-icons/fluentui-system-regular/TableInsertColumn';
import { TableInsertRow } from '@styled-icons/fluentui-system-regular/TableInsertRow';
import React, { useRef, useState } from 'react';
import { Path, Transforms } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
import styled from 'styled-components';
import { useOnClickOutside } from '../../../../hooks/use-on-click-outside';
import { mergeCells, splitCell } from '../../functions/table/cells';
import { insertColumnLeft, insertColumnRight } from '../../functions/table/insert-column';
import { removeColumn } from '../../functions/table/remove-column';
import { insertRowAbove, insertRowBelow, removeRow } from '../../functions/table/rows';
import { TableTypeEnum } from '../../types/editor-enums';
import { isOfElementType } from '../../types/editor-type-guards';
import { TableCellElementType } from '../../types/editor-types';

interface MenuProps {
  show: boolean;
  close: () => void;
  x: number;
  y: number;
  element: TableCellElementType;
}

export const Menu = ({ show, close, x, y, element }: MenuProps) => {
  const editor = useSlateStatic();
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, close);

  if (!show) {
    return null;
  }

  const onClick = (callback: () => Path) => {
    const selectionPath = callback();
    ReactEditor.focus(editor);
    Transforms.select(editor, selectionPath);
    close();
  };

  return (
    <StyledMenu ref={ref} contentEditable={false} $x={x} $y={y} onClick={(e) => e.stopPropagation()}>
      <MenuButton
        onClick={() => onClick(() => insertRowAbove(editor, element))}
        icon={<TableInsertRow width={16} aria-hidden />}
      >
        Legg til rad over
      </MenuButton>
      <MenuButton
        onClick={() => onClick(() => insertRowBelow(editor, element))}
        icon={<TableInsertRow width={16} aria-hidden />}
      >
        Legg til rad under
      </MenuButton>
      <MenuButton
        onClick={() => onClick(() => insertColumnRight(editor, element))}
        icon={<TableInsertColumn width={16} aria-hidden />}
      >
        Legg til kolonne til høyre
      </MenuButton>
      <MenuButton
        onClick={() => onClick(() => insertColumnLeft(editor, element))}
        icon={<TableInsertColumn width={16} aria-hidden />}
      >
        Legg til kolonne til venstre
      </MenuButton>
      <MenuButton
        onClick={() => onClick(() => removeRow(editor, element))}
        icon={<TableDeleteRow width={16} aria-hidden />}
      >
        Fjern rad
      </MenuButton>
      <MenuButton
        onClick={() => onClick(() => removeColumn(editor, element))}
        icon={<TableDeleteColumn width={16} aria-hidden />}
      >
        Fjern kolonne
      </MenuButton>
      <MenuButton
        onClick={() => onClick(() => mergeCells(editor, element))}
        icon={<TableCellsMerge width={16} aria-hidden />}
      >
        Slå sammen med celle til høyre
      </MenuButton>
      <MenuButton
        onClick={() => onClick(() => splitCell(editor, element))}
        icon={<TableCellsSplit width={16} aria-hidden />}
        show={element.colSpan !== 1}
      >
        Splitt celle vertikalt
      </MenuButton>
      <DeleteTable close={close} />
      <StyledHr />
      <MenuButton onClick={close} icon={<Close aria-hidden />}>
        Lukk
      </MenuButton>
    </StyledMenu>
  );
};

interface DeleteTableProps {
  close: () => void;
}

const DeleteTable = ({ close }: DeleteTableProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleConfirm = () => setShowConfirm(!showConfirm);
  const editor = useSlateStatic();

  const removeTable = () => {
    close();
    Transforms.removeNodes(editor, { match: (n) => isOfElementType(n, TableTypeEnum.TABLE) });
  };

  return (
    <StyledDeleteButtonContainer>
      <MenuButton onClick={toggleConfirm} icon={<TableDismiss width={16} aria-hidden />}>
        {showConfirm ? 'Avbryt' : 'Slett tabell'}
      </MenuButton>
      {showConfirm ? (
        <BaseButton
          size="xsmall"
          variant="danger"
          icon={<Delete aria-hidden />}
          onClick={removeTable}
          title="Slett tabell"
        />
      ) : null}
    </StyledDeleteButtonContainer>
  );
};

interface MenuButtonProps {
  show?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
  variant?: string;
}

const MenuButton = ({ show = true, onClick, children, icon, variant = 'tertiary' }: MenuButtonProps) => {
  if (!show) {
    return null;
  }

  return (
    <StyledButton size="xsmall" variant={variant} onClick={onClick} icon={icon}>
      {children}
    </StyledButton>
  );
};

const StyledMenu = styled.div<{ $x: number; $y: number }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: ${({ $y }) => $y}px;
  left: ${({ $x }) => $x}px;
  background-color: white;
  z-index: 10;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.25);
  user-select: none;
`;

const BaseButton = styled(Button)`
  white-space: nowrap;
  justify-content: flex-start;
  cursor: pointer;
`;

const StyledButton = styled(BaseButton)`
  flex-grow: 1;
`;

const StyledDeleteButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledHr = styled.hr`
  width: 100%;
  color: #fefefe;
`;
