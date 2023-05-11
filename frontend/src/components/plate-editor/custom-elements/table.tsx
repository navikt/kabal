import { Tooltip } from '@navikt/ds-react';
import { PlateRenderElementProps } from '@udecode/plate-core';
import React from 'react';
import styled from 'styled-components';
import {
  AddNewParagraphAbove,
  AddNewParagraphBelow,
} from '@app/components/plate-editor/custom-elements/common/add-new-paragraph-buttons';
import { EditorValue, TableElement } from '../types';

type Props = PlateRenderElementProps<EditorValue, TableElement>;

export const Table = ({ attributes, children, element, editor }: Props) => (
  <Container>
    <TableTooltip element={element} editor={editor}>
      <StyledTable {...attributes}>{children}</StyledTable>
    </TableTooltip>
  </Container>
);

type TableTooltipProps = Pick<Props, 'children' | 'element' | 'editor'>;

const TableTooltip = ({ children, element, editor }: TableTooltipProps) => (
  <>
    <Tooltip content="Høyreklikk for å endre tabellen" placement="top">
      {children}
    </Tooltip>
    <StyledAboveButton editor={editor} element={element} />
    <StyledBelowButton editor={editor} element={element} />
  </>
);

const BORDER_WIDTH = 1;

const StyledTable = styled.table`
  border-collapse: collapse;
  max-width: 100%;
  margin: 0;

  tr {
    :nth-child(odd) {
      background-color: var(--a-surface-subtle);
    }
    :nth-child(even) {
      background-color: var(--a-surface-default);
    }
  }

  td {
    border: ${BORDER_WIDTH}px solid var(--a-border-default);
    min-width: 32px;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 8px;
    padding-right: 8px;
  }
`;

const StyledAboveButton = styled(AddNewParagraphAbove)`
  position: absolute;
  right: 100%;
  top: -${BORDER_WIDTH}px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  :focus {
    opacity: 1;
  }
`;

const StyledBelowButton = styled(AddNewParagraphBelow)`
  position: absolute;
  left: 100%;
  bottom: -${BORDER_WIDTH}px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  :focus {
    opacity: 1;
  }
`;

const Container = styled.div`
  position: relative;
  max-width: 100%;

  &:hover {
    ${StyledBelowButton}, ${StyledAboveButton} {
      opacity: 1;
    }
  }
`;
