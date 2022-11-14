import React, { useMemo } from 'react';
import styled from 'styled-components';
import { SaksbehandlerAccessRights } from '../../redux-api/access-rights';
import { IYtelse } from '../../types/kodeverk';
import { Row } from './row';

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
    <Tbody>
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
    </Tbody>
  );
};

const Tbody = styled.tbody``;
