import { Skeleton } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import { useSetMedunderskriver } from '@/components/oppgavestyring/use-set-medunderskriver';
import { toNavEmployeeEntry } from '@/components/searchable-select/searchable-single-select/searchable-nav-employee-select';
import { SearchableSelect } from '@/components/searchable-select/searchable-single-select/searchable-single-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { useHasRole } from '@/hooks/use-has-role';
import { useGetPotentialMedunderskrivereQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';
import { type INavEmployee, Role } from '@/types/bruker';

interface Props {
  oppgaveId: string;
  medunderskriverIdent: string | null;
}

const NONE_LABEL = 'Ingen';
const NONE_ENTRY: Entry<INavEmployee | null> = {
  value: null,
  key: '__none__',
  plainText: NONE_LABEL,
  label: NONE_LABEL,
};
const EMPTY_LIST: INavEmployee[] = [];

export const Medunderskriver = ({ oppgaveId, medunderskriverIdent }: Props) => {
  const { data, isLoading } = useGetPotentialMedunderskrivereQuery(oppgaveId);
  const hasAccess = useHasRole(Role.KABAL_INNSYN_EGEN_ENHET);

  const medunderskrivere = data === undefined ? EMPTY_LIST : data.medunderskrivere;

  const { onChange, isUpdating } = useSetMedunderskriver(oppgaveId, medunderskrivere);

  const options = useMemo(
    (): Entry<INavEmployee | null>[] => [NONE_ENTRY, ...medunderskrivere.map(toNavEmployeeEntry)],
    [medunderskrivere],
  );

  const selectedEntry = useMemo(
    (): Entry<INavEmployee | null> | null =>
      medunderskriverIdent === null ? null : (options.find((e) => e.key === medunderskriverIdent) ?? null),
    [medunderskriverIdent, options],
  );

  const handleChange = useCallback(
    (employee: INavEmployee | null) => {
      onChange(employee?.navIdent ?? null, medunderskriverIdent);
    },
    [onChange, medunderskriverIdent],
  );

  if (!hasAccess) {
    return null;
  }

  if (isLoading || data === undefined) {
    return <Skeleton />;
  }

  return (
    <SearchableSelect
      label="Medunderskriver"
      options={options}
      value={selectedEntry}
      onChange={handleChange}
      loading={isUpdating}
      nullLabel={NONE_LABEL}
      confirmLabel="Send til medunderskriver"
      flip
      requireConfirmation
    />
  );
};
