import { useSetMedunderskriver } from '@app/components/oppgavestyring/use-set-medunderskriver';
import { SearchableNavEmployeeSelect } from '@app/components/searchable-select/searchable-nav-employee-select';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetPotentialMedunderskrivereQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { type INavEmployee, Role } from '@app/types/bruker';
import { Skeleton } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';

interface Props {
  oppgaveId: string;
  medunderskriverIdent: string | null;
}

const EMPTY_LIST: INavEmployee[] = [];

export const Medunderskriver = ({ oppgaveId, medunderskriverIdent }: Props) => {
  const { data, isLoading } = useGetPotentialMedunderskrivereQuery(oppgaveId);
  const hasAccess = useHasRole(Role.KABAL_INNSYN_EGEN_ENHET);

  const medunderskrivere = data === undefined ? EMPTY_LIST : data.medunderskrivere;

  const { onChange, isUpdating } = useSetMedunderskriver(oppgaveId, medunderskrivere);

  const selectedValue = useMemo(
    (): INavEmployee | null =>
      medunderskriverIdent === null
        ? null
        : (medunderskrivere.find(({ navIdent }) => navIdent === medunderskriverIdent) ?? null),
    [medunderskrivere, medunderskriverIdent],
  );

  const handleChange = useCallback(
    (employee: INavEmployee) => {
      onChange(employee.navIdent, medunderskriverIdent);
    },
    [onChange, medunderskriverIdent],
  );

  const handleClear = useCallback(() => {
    onChange(null, medunderskriverIdent);
  }, [onChange, medunderskriverIdent]);

  if (!hasAccess) {
    return null;
  }

  if (isLoading || data === undefined) {
    return <Skeleton />;
  }

  return (
    <SearchableNavEmployeeSelect
      label="Medunderskriver"
      options={medunderskrivere}
      value={selectedValue}
      onChange={handleChange}
      onClear={handleClear}
      disabled={isUpdating}
      nullLabel="Ingen"
      confirmLabel="Sett medunderskriver"
    />
  );
};
