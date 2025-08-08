import type { SaksbehandlerAccessRights } from '@app/redux-api/access-rights';
import { useLatestYtelser } from '@app/simple-api-state/use-kodeverk';
import type { IYtelse } from '@app/types/kodeverk';
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
  const isRowFocused = rowIndex === focusedRow;

  return (
    <tr key={ytelse.id}>
      <th
        className={`relative z-1 m-0 h-8 max-w-64 border-ax-border-neutral border-x border-b ${isRowFocused ? 'bg-ax-bg-neutral-strong text-ax-text-neutral-contrast' : 'text-ax-text-neutral'} p-0`}
        title={ytelseTitle}
        onMouseEnter={() => setFocusedCell([-1, rowIndex])}
      >
        <span className="justify-left flex h-full w-full items-center overflow-hidden whitespace-nowrap px-2 hover:w-fit hover:overflow-visible hover:bg-ax-accent-200">
          <span className="truncate">{ytelseTitle}</span>
        </span>
      </th>
      <Cell
        isChecked={accessRights.every(({ ytelseIdList }) => ytelseIdList.includes(ytelse.id))}
        onCheck={(checked) => onCheck(checked, ytelse.id, null)}
        onFocus={() => setFocusedCell([0, rowIndex])}
        isCurrentColumn={focusedColumn === 0 && (rowIndex < focusedRow || focusedRow === -1)}
        isCurrentRow={isRowFocused}
        isFocused={isRowFocused && focusedColumn === 0}
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
          isCurrentRow={isRowFocused && (columnIndex + 1 < focusedColumn || focusedColumn === -1)}
          isFocused={isRowFocused && focusedColumn === columnIndex + 1}
        >
          {`${ytelseIdList.includes(ytelse.id) ? 'Fjern' : 'Legg til'} ${saksbehandlerName} / ${ytelse.navn}`}
        </Cell>
      ))}
    </tr>
  );
};

const useNumberOfSaksbehandlerePerYtelse = (ytelseId: string, accessRights: SaksbehandlerAccessRights[]): number => {
  const { data: ytelser = [] } = useLatestYtelser();

  const ytelse = ytelser.find((y) => y.id === ytelseId);

  if (typeof ytelse === 'undefined') {
    return 0;
  }

  return accessRights.filter(({ ytelseIdList }) => ytelseIdList.includes(ytelse.id)).length;
};
