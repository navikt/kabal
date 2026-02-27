import { SearchableNavEmployeeSelect } from '@app/components/searchable-select/searchable-nav-employee-select';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetPotentialRolQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { type INavEmployee, Role } from '@app/types/bruker';
import { Skeleton } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import { useSetRol } from '../oppgavestyring/use-set-rol';

interface Props {
  oppgaveId: string;
  rolIdent: string | null;
}

const EMPTY_LIST: INavEmployee[] = [];

export const Rol = ({ oppgaveId, rolIdent }: Props) => {
  const { data, isLoading } = useGetPotentialRolQuery(oppgaveId);
  const hasAccess = useHasRole(Role.KABAL_KROL);

  const rols = data === undefined ? EMPTY_LIST : data.rols;

  const { onChange, isUpdating } = useSetRol(oppgaveId, rols);

  const selectedValue = useMemo(
    (): INavEmployee | null =>
      rolIdent === null ? null : (rols.find(({ navIdent }) => navIdent === rolIdent) ?? null),
    [rols, rolIdent],
  );

  const handleChange = useCallback(
    (employee: INavEmployee) => {
      onChange(employee.navIdent, rolIdent);
    },
    [onChange, rolIdent],
  );

  const handleClear = useCallback(() => {
    onChange(null, rolIdent);
  }, [onChange, rolIdent]);

  if (!hasAccess) {
    return null;
  }

  if (isLoading || data === undefined) {
    return <Skeleton />;
  }

  return (
    <SearchableNavEmployeeSelect
      label="Rådgivende overlege"
      options={rols}
      value={selectedValue}
      onChange={handleChange}
      onClear={handleClear}
      disabled={isUpdating}
      nullLabel="Felles kø"
      confirmLabel="Sett rådgivende overlege"
    />
  );
};
