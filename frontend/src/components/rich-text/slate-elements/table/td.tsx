import React, { useCallback, useMemo, useState } from 'react';
import { Editor } from 'slate';
import { ReactEditor, useSelected, useSlateStatic } from 'slate-react';
import styled from 'styled-components';
import { UndeletableContentEnum } from '../../types/editor-enums';
import { isOfElementType } from '../../types/editor-type-guards';
import { MaltekstElementType, TableCellElementType } from '../../types/editor-types';
import { RenderElementProps } from '../render-props';
import { Menu } from './menu';

export const TableCellElement = (props: RenderElementProps<TableCellElementType>) => {
  const editor = useSlateStatic();
  const nonEditable = useMemo<boolean>(() => {
    const path = ReactEditor.findPath(editor, props.element);
    const [maltekstEntry] = Editor.nodes(editor, {
      at: path,
      match: (n) => isOfElementType<MaltekstElementType>(n, UndeletableContentEnum.MALTEKST),
    });

    return maltekstEntry !== undefined;
  }, [editor, props.element]);

  if (nonEditable) {
    return <NonEditableTableCellElement {...props} />;
  }

  return <EditableTableCellElement {...props} />;
};

const NonEditableTableCellElement = ({ element, attributes, children }: RenderElementProps<TableCellElementType>) => (
  <StyledTableCell
    {...attributes}
    colSpan={element.colSpan}
    $isSelected={false}
    onDragStart={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
    onDrop={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
    onPaste={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
  >
    <CellContent>{children}</CellContent>
  </StyledTableCell>
);

const EditableTableCellElement = ({ element, attributes, children }: RenderElementProps<TableCellElementType>) => {
  const isSelected = useSelected();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [[x, y], setCoordinates] = useState<[number, number]>([0, 0]);

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(true);
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const xx = Math.round(e.clientX - left);
    const yy = Math.round(e.clientY - top);
    setCoordinates([xx, yy]);
  }, []);

  const onClick = () => setIsMenuOpen(false);

  return (
    <StyledTableCell
      {...attributes}
      colSpan={element.colSpan}
      $isSelected={isSelected || isMenuOpen}
      onContextMenu={onContextMenu}
      onClick={onClick}
    >
      <CellContent onClick={onClick}>{children}</CellContent>
      <Menu show={isMenuOpen} x={x} y={y} close={() => setIsMenuOpen(false)} element={element} />
    </StyledTableCell>
  );
};

export const BORDER_WIDTH = 1;

const StyledTableCell = styled.td<{ $isSelected: boolean }>`
  position: relative;
  border: ${BORDER_WIDTH}px solid var(--navds-table-cell-color-border);
  min-width: 32px;
  word-break: normal;
  white-space: pre-wrap;
  vertical-align: top;
  text-align: left;
  padding: 0;

  ::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    background-color: ${({ $isSelected }) => ($isSelected ? 'var(--navds-global-color-blue-100)' : 'transparent')};
  }
`;

const CellContent = styled.div`
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 8px;
  padding-right: 8px;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
`;
