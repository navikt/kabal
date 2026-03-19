import { useMemo } from 'react';
import { Row } from '@/components/access-rights/row';
import type { SaksbehandlerAccessRights } from '@/redux-api/access-rights';
import type { IYtelse } from '@/types/kodeverk';

interface Props {
  ytelser: IYtelse[];
  accessRights: SaksbehandlerAccessRights[];
  onCheck: (checked: boolean, ytelseId: string, saksbehandlerIdent: string | null) => void;
  focusedCell: [number, number];
  setFocusedCell: (cell: [number, number]) => void;
}

export const Body = ({
  ytelser,
  accessRights,
  onCheck,
  focusedCell: [focusedColumn, focusedRow],
  setFocusedCell,
}: Props) => {
  const sortedYtelser = useMemo(() => ytelser.sort((a, b) => a.navn.localeCompare(b.navn)), [ytelser]);

  return (
    <tbody>
      {sortedYtelser.map((ytelse, rowIndex) => (
        <Row
          key={ytelse.id}
          accessRights={accessRights}
          rowIndex={rowIndex}
          onCheck={onCheck}
          ytelse={ytelse}
          focusedCell={[focusedColumn, focusedRow]}
          setFocusedCell={setFocusedCell}
        />
      ))}
    </tbody>
  );
};
