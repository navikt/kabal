import { Select, Skeleton } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetPotentialRolQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { INavEmployee, Role } from '@app/types/bruker';
import { useSetRol } from '../oppgavestyring/use-set-rol';

interface Props {
  oppgaveId: string;
  rolIdent: string | null;
}

const NONE_SELECTED = 'NONE_SELECTED';
const EMPTY_LIST: INavEmployee[] = [];

export const Rol = ({ oppgaveId, rolIdent }: Props) => {
  const { data, isLoading } = useGetPotentialRolQuery(oppgaveId);
  const hasAccess = useHasRole(Role.KABAL_KROL);

  const rols = data === undefined ? EMPTY_LIST : data.rols;

  const { onChange, isUpdating } = useSetRol(oppgaveId, rols);

  const options = useMemo(
    () =>
      rols.map(({ navIdent, navn }) => (
        <option key={navIdent} value={navIdent}>
          {navn}
        </option>
      )),
    [rols],
  );

  if (!hasAccess) {
    return null;
  }

  if (isLoading || data === undefined) {
    return <Skeleton />;
  }

  return (
    <Select
      label="Rådgivende overlege"
      size="small"
      hideLabel
      value={rolIdent ?? NONE_SELECTED}
      onChange={({ target }) => onChange(target.value === NONE_SELECTED ? null : target.value, rolIdent)}
      disabled={isUpdating}
    >
      <option value={NONE_SELECTED}>Felles kø</option>
      {options}
    </Select>
  );
};
