import { Loader, Select } from '@navikt/ds-react';
import React from 'react';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useUpdateChosenMedunderskriverMutation } from '@app/redux-api/oppgaver/mutations/set-medunderskriver';
import { useGetPotentialMedunderskrivereQuery } from '@app/redux-api/oppgaver/queries/behandling';
import { INavEmployee } from '@app/types/oppgave-common';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { getTitleCapitalized, getTitleLowercase, getTitlePlural } from './getTitle';

type SelectMedunderskriverProps = Pick<IOppgavebehandling, 'id' | 'ytelseId' | 'medunderskriver' | 'typeId'>;

const NONE_SELECTED = 'NONE_SELECTED';

export const SelectMedunderskriver = ({ id, medunderskriver, typeId }: SelectMedunderskriverProps) => {
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
