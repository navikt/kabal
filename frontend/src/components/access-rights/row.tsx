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
  const isFocused = rowIndex === focusedRow;

  return (
    <tr key={ytelse.id}>
      <th
        className={`relative z-1 m-0 h-8 max-w-64 border-(--a-border-on-inverted) border-x border-b ${isFocused ? 'bg-(--a-blue-200)' : 'bg-(--a-bg-default)'} p-0`}
        title={ytelseTitle}
        onMouseEnter={() => setFocusedCell([-1, rowIndex])}
      >
        <span className="justify-left flex h-full w-full items-center overflow-hidden whitespace-nowrap px-2 hover:w-fit hover:overflow-visible hover:bg-(--a-blue-200)">
          <span className="overflow-hidden text-ellipsis">{ytelseTitle}</span>
        </span>
      </th>
      <Cell
        isChecked={accessRights.every(({ ytelseIdList }) => ytelseIdList.includes(ytelse.id))}
        onCheck={(checked) => onCheck(checked, ytelse.id, null)}
        onFocus={() => setFocusedCell([0, rowIndex])}
        isCurrentColumn={focusedColumn === 0 && (rowIndex < focusedRow || focusedRow === -1)}
        isCurrentRow={isFocused}
        isFocused={focusedColumn === 0 && isFocused}
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
          isCurrentRow={isFocused && (columnIndex + 1 < focusedColumn || focusedColumn === -1)}
          isFocused={focusedColumn === columnIndex + 1 && isFocused}
        >
          {`${saksbehandlerName} / ${ytelse.navn}`}
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
