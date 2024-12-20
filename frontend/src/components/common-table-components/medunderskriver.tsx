import { useSetMedunderskriver } from '@app/components/oppgavestyring/use-set-medunderskriver';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetPotentialMedunderskrivereQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { type INavEmployee, Role } from '@app/types/bruker';
import { Select, Skeleton } from '@navikt/ds-react';
import { useMemo } from 'react';

interface Props {
  oppgaveId: string;
  medunderskriverIdent: string | null;
}

const NONE_SELECTED = 'NONE_SELECTED';
const EMPTY_LIST: INavEmployee[] = [];

export const Medunderskriver = ({ oppgaveId, medunderskriverIdent }: Props) => {
  const { data, isLoading } = useGetPotentialMedunderskrivereQuery(oppgaveId);
  const hasAccess = useHasRole(Role.KABAL_INNSYN_EGEN_ENHET);

  const medunderskrivere = data === undefined ? EMPTY_LIST : data.medunderskrivere;

  const { onChange, isUpdating } = useSetMedunderskriver(oppgaveId, medunderskrivere);

  const options = useMemo(
    () =>
      medunderskrivere.map(({ navIdent, navn }) => (
        <option key={navIdent} value={navIdent}>
          {navn}
        </option>
      )),
    [medunderskrivere],
  );

  if (!hasAccess) {
    return null;
  }

  if (isLoading || data === undefined) {
    return <Skeleton />;
  }

  return (
    <Select
      label="Medunderskriver"
      size="small"
      hideLabel
      value={medunderskriverIdent ?? NONE_SELECTED}
      onChange={({ target }) => onChange(target.value === NONE_SELECTED ? null : target.value, medunderskriverIdent)}
      disabled={isUpdating}
    >
      <option value={NONE_SELECTED}>Ingen</option>
      {options}
    </Select>
  );
};
