import React from 'react';
import styled from 'styled-components';
import { SaksbehandlerAccessRights } from '../../redux-api/access-rights';
import { useVersionedYtelser } from '../../simple-api-state/use-kodeverk';
import { IYtelse } from '../../types/kodeverk';
import { Cell } from './cell';

interface Props {
  ytelse: IYtelse;
  focusedCell: [number, number];
  setFocusedCell: (cell: [number, number]) => void;
  onCheck: (checked: boolean, ytelseId: string, saksbehandlerIdent: string | null) => void;
  rowIndex: number;
  accessRights: SaksbehandlerAccessRights[];
}

export const Row = ({
  accessRights,
  rowIndex,
  onCheck,
  ytelse,
  focusedCell: [focusedColumn, focusedRow],
  setFocusedCell,
}: Props) => {
  const numberOfSaksbehandlerePerYtelse = useNumberOfSaksbehandlerePerYtelse(ytelse.id, accessRights);

  const ytelseTitle = `(${numberOfSaksbehandlerePerYtelse}/${accessRights.length}) ${ytelse.navn} `;

  return (
    <tr key={ytelse.id}>
      <StyledHeader
        title={ytelseTitle}
        $isHighlighted={rowIndex === focusedRow}
        onMouseEnter={() => setFocusedCell([-1, rowIndex])}
      >
        <StyledHeaderText>
          <HeaderEllipsis>{ytelseTitle}</HeaderEllipsis>
        </StyledHeaderText>
      </StyledHeader>
      <Cell
        isChecked={accessRights.every(({ ytelseIdList }) => ytelseIdList.includes(ytelse.id))}
        onCheck={(checked) => onCheck(checked, ytelse.id, null)}
        onFocus={() => setFocusedCell([0, rowIndex])}
        isCurrentColumn={focusedColumn === 0 && (rowIndex < focusedRow || focusedRow === -1)}
        isCurrentRow={rowIndex === focusedRow}
        isFocused={focusedColumn === 0 && rowIndex === focusedRow}
      >
        {`Alle saksbehandlere / ${ytelse.navn}`}
      </Cell>
      {accessRights.map(({ saksbehandlerName, saksbehandlerIdent, ytelseIdList }, columnIndex) => (
        <Cell
          key={saksbehandlerIdent}
          isChecked={ytelseIdList.includes(ytelse.id)}
          onCheck={(checked) => onCheck(checked, ytelse.id, saksbehandlerIdent)}
          onFocus={() => setFocusedCell([columnIndex + 1, rowIndex])}
          isCurrentColumn={columnIndex + 1 === focusedColumn && (rowIndex < focusedRow || focusedRow === -1)}
          isCurrentRow={rowIndex === focusedRow && (columnIndex + 1 < focusedColumn || focusedColumn === -1)}
          isFocused={focusedColumn === columnIndex + 1 && rowIndex === focusedRow}
        >
          {`${saksbehandlerName} / ${ytelse.navn}`}
        </Cell>
      ))}
    </tr>
  );
};

const StyledHeaderText = styled.span`
  display: flex;
  overflow: hidden;
  height: 100%;
  min-width: 100%;
  padding-left: 8px;
  padding-right: 8px;
  white-space: nowrap;
  align-items: center;
  justify-content: left;

  :hover {
    overflow: visible;
    text-overflow: unset;
    background-color: var(--a-blue-200);
    box-shadow: 2px 2px 5px 0px var(--a-border-on-inverted);
    width: fit-content;
  }
`;

const StyledHeader = styled.th<{ $isHighlighted: boolean }>`
  height: 32px;
  border-right: 1px solid var(--a-border-on-inverted);
  border-left: 1px solid var(--a-border-on-inverted);
  border-bottom: 1px solid var(--a-border-on-inverted);
  padding: 0;
  margin: 0;
  max-width: 256px;
  position: relative;
  z-index: 1;
  background-color: ${({ $isHighlighted }) => ($isHighlighted ? 'var(--a-blue-200)' : 'rgb(247, 247, 247)')};

  :hover {
    overflow: visible;
  }
`;

const HeaderEllipsis = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const useNumberOfSaksbehandlerePerYtelse = (ytelseId: string, accessRights: SaksbehandlerAccessRights[]): number => {
  const { data: ytelser = [] } = useVersionedYtelser();

  const ytelse = ytelser.find((y) => y.id === ytelseId);

  if (typeof ytelse === 'undefined') {
    return 0;
  }

  return accessRights.filter(({ ytelseIdList }) => ytelseIdList.includes(ytelse.id)).length;
};
