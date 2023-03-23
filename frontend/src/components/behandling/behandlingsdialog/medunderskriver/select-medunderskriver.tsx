import { Loader, Select } from '@navikt/ds-react';
import React from 'react';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useUpdateChosenMedunderskriverMutation } from '@app/redux-api/oppgaver/mutations/set-medunderskriver';
import { useGetPotentialMedunderskrivereQuery } from '@app/redux-api/oppgaver/queries/behandling';
import { ISaksbehandler } from '@app/types/oppgave-common';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { getTitleCapitalized, getTitleLowercase, getTitlePlural } from './getTitle';

type SelectMedunderskriverProps = Pick<IOppgavebehandling, 'id' | 'ytelse' | 'medunderskriver' | 'type'>;

const NONE_SELECTED = 'NONE_SELECTED';

export const SelectMedunderskriver = ({ id, medunderskriver, type }: SelectMedunderskriverProps) => {
  const canEdit = useCanEdit();
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
    return <p>Fant ingen {getTitlePlural(type)}</p>;
  }

  const onChangeChosenMedunderskriver = (medunderskriverident: string | null) =>
    updateChosenMedunderskriver({
      oppgaveId: id,
      medunderskriver:
        medunderskriverident === null
          ? null
          : medunderskrivere
              .map<ISaksbehandler>(({ navIdent, navn }) => ({ navIdent, navn }))
              .find(({ navIdent }) => navIdent === medunderskriverident) ?? null,
    });

  return (
    <Select
      size="small"
      disabled={!canEdit}
      label={`${getTitleCapitalized(type)}:`}
      onChange={({ target }) => onChangeChosenMedunderskriver(target.value === NONE_SELECTED ? null : target.value)}
      value={medunderskriver?.navIdent ?? NONE_SELECTED}
      data-testid="select-medunderskriver"
    >
      <option value={NONE_SELECTED}>Ingen {getTitleLowercase(type)}</option>
      {medunderskrivere.map(({ navn, navIdent }) => (
        <option key={navIdent} value={navIdent}>
          {navn}
        </option>
      ))}
    </Select>
  );
};
