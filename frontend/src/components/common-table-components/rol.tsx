import { Skeleton } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import { useSetRol } from '@/components/oppgavestyring/use-set-rol';
import { toNavEmployeeEntry } from '@/components/searchable-select/searchable-single-select/searchable-nav-employee-select';
import { SearchableSelect } from '@/components/searchable-select/searchable-single-select/searchable-single-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { useHasRole } from '@/hooks/use-has-role';
import { useGetPotentialRolQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';
import { type INavEmployee, Role } from '@/types/bruker';

interface Props {
  oppgaveId: string;
  rolIdent: string | null;
}

const NONE_LABEL = 'Felles kø';
const NONE_ENTRY: Entry<INavEmployee | null> = {
  value: null,
  key: '__none__',
  plainText: NONE_LABEL,
  label: NONE_LABEL,
};
const EMPTY_LIST: INavEmployee[] = [];

export const Rol = ({ oppgaveId, rolIdent }: Props) => {
  const { data, isLoading } = useGetPotentialRolQuery(oppgaveId);
  const hasAccess = useHasRole(Role.KABAL_KROL);

  const rols = data === undefined ? EMPTY_LIST : data.rols;

  const { onChange, isUpdating } = useSetRol(oppgaveId, rols);

  const options = useMemo((): Entry<INavEmployee | null>[] => [NONE_ENTRY, ...rols.map(toNavEmployeeEntry)], [rols]);

  const selectedEntry = useMemo(
    (): Entry<INavEmployee | null> | null =>
      rolIdent === null ? null : (options.find((e) => e.key === rolIdent) ?? null),
    [rolIdent, options],
  );

  const handleChange = useCallback(
    (employee: INavEmployee | null) => {
      onChange(employee?.navIdent ?? null, rolIdent);
    },
    [onChange, rolIdent],
  );

  if (!hasAccess) {
    return null;
  }

  if (isLoading || data === undefined) {
    return <Skeleton />;
  }

  return (
    <SearchableSelect
      label="Rådgivende overlege"
      options={options}
      value={selectedEntry}
      onChange={handleChange}
      loading={isUpdating}
      nullLabel={NONE_LABEL}
      confirmLabel="Send til rådgivende overlege"
      requireConfirmation
    />
  );
};
