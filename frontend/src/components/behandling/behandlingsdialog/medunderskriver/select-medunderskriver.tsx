import { Loader, Select } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useUpdateChosenMedunderskriverMutation } from '@app/redux-api/oppgaver/mutations/set-medunderskriver';
import { useGetPotentialMedunderskrivereQuery } from '@app/redux-api/oppgaver/queries/behandling';
import { Role } from '@app/types/bruker';
import { INavEmployee } from '@app/types/oppgave-common';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { getTitleCapitalized, getTitleLowercase, getTitlePlural } from './getTitle';

type SelectMedunderskriverProps = Pick<IOppgavebehandling, 'id' | 'ytelseId' | 'medunderskriver' | 'typeId'>;

const NONE_SELECTED = 'NONE_SELECTED';

const useCanChangeMedunderskriver = () => {
  const { data: oppgavebehandling, isLoading: oppgavebehandlingIsLoading } = useOppgave();
  const isSaksbehandler = useIsSaksbehandler();
  const isFinished = useIsFullfoert();

  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);

  return useMemo(() => {
    if (oppgavebehandlingIsLoading || typeof oppgavebehandling === 'undefined') {
      return false;
    }

    return !isFinished && (isSaksbehandler || hasOppgavestyringRole) && oppgavebehandling.feilregistrering === null;
  }, [oppgavebehandlingIsLoading, oppgavebehandling, isFinished, isSaksbehandler, hasOppgavestyringRole]);
};

export const SelectMedunderskriver = ({ id, medunderskriver, typeId }: SelectMedunderskriverProps) => {
  const canEdit = useCanChangeMedunderskriver();
  const [updateChosenMedunderskriver] = useUpdateChosenMedunderskriverMutation({ fixedCacheKey: id });
  const { data } = useGetPotentialMedunderskrivereQuery(id);

  if (!canEdit) {
    return null;
  }

  if (typeof data === 'undefined') {
    return <Loader size="xlarge" />;
  }

  const { medunderskrivere } = data;

  if (medunderskrivere.length === 0) {
    return <p>Fant ingen {getTitlePlural(typeId)}</p>;
  }

  const onChangeChosenMedunderskriver = (medunderskriverident: string | null) =>
    updateChosenMedunderskriver({
      oppgaveId: id,
      medunderskriver:
        medunderskriverident === null
          ? null
          : medunderskrivere
              .map<INavEmployee>(({ navIdent, navn }) => ({ navIdent, navn }))
              .find(({ navIdent }) => navIdent === medunderskriverident) ?? null,
    });

  return (
    <Select
      size="small"
      disabled={!canEdit}
      label={`${getTitleCapitalized(typeId)}:`}
      onChange={({ target }) => onChangeChosenMedunderskriver(target.value === NONE_SELECTED ? null : target.value)}
      value={medunderskriver?.navIdent ?? NONE_SELECTED}
      data-testid="select-medunderskriver"
    >
      <option value={NONE_SELECTED}>Ingen {getTitleLowercase(typeId)}</option>
      {medunderskrivere.map(({ navn, navIdent }) => (
        <option key={navIdent} value={navIdent}>
          {navn}
        </option>
      ))}
    </Select>
  );
};
