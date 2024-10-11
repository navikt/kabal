import type { SaksbehandlerAccessRights } from '@app/redux-api/access-rights';
import { useLatestYtelser } from '@app/simple-api-state/use-kodeverk';
import type { IYtelse } from '@app/types/kodeverk';
import { styled } from 'styled-components';
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
  padding-left: var(--a-spacing-2);
  padding-right: var(--a-spacing-2);
  white-space: nowrap;
  align-items: center;
  justify-content: left;

  &:hover {
    overflow: visible;
    text-overflow: unset;
    background-color: var(--a-blue-200);
    box-shadow: var(--a-spacing-05) var(--a-spacing-05) 5px 0px var(--a-border-on-inverted);
    width: fit-content;
  }
`;

const StyledHeader = styled.th<{ $isHighlighted: boolean }>`
  height: var(--a-spacing-8);
  border-right: 1px solid var(--a-border-on-inverted);
  border-left: 1px solid var(--a-border-on-inverted);
  border-bottom: 1px solid var(--a-border-on-inverted);
  padding: 0;
  margin: 0;
  max-width: 256px;
  position: relative;
  z-index: 1;
  background-color: ${({ $isHighlighted }) => ($isHighlighted ? 'var(--a-blue-200)' : 'rgb(247, 247, 247)')};

  &:hover {
    overflow: visible;
  }
`;

const HeaderEllipsis = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const useNumberOfSaksbehandlerePerYtelse = (ytelseId: string, accessRights: SaksbehandlerAccessRights[]): number => {
  const { data: ytelser = [] } = useLatestYtelser();

  const ytelse = ytelser.find((y) => y.id === ytelseId);

  if (typeof ytelse === 'undefined') {
    return 0;
  }

  return accessRights.filter(({ ytelseIdList }) => ytelseIdList.includes(ytelse.id)).length;
};
