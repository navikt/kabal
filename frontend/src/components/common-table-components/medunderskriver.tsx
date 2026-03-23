import { Skeleton } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import { useSetMedunderskriver } from '@/components/oppgavestyring/use-set-medunderskriver';
import { SearchableNavEmployeeSelect } from '@/components/searchable-select/searchable-single-select/searchable-nav-employee-select';
import { useHasRole } from '@/hooks/use-has-role';
import { useGetPotentialMedunderskrivereQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';
import { type INavEmployee, Role } from '@/types/bruker';

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
      loading={isUpdating}
      nullLabel="Ingen"
      confirmLabel="Send til medunderskriver"
      flip
    />
  );
};
