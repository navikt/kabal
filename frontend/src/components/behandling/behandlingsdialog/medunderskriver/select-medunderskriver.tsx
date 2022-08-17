import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { Select } from 'nav-frontend-skjema';
import React from 'react';
import { useOppgave } from '../../../../hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useSearchMedunderskrivereQuery } from '../../../../redux-api/bruker';
import { useUpdateChosenMedunderskriverMutation } from '../../../../redux-api/oppgaver/mutations/set-medunderskriver';
import { useUser } from '../../../../simple-api-state/use-user';
import { ISaksbehandler } from '../../../../types/oppgave-common';
import { IOppgavebehandling } from '../../../../types/oppgavebehandling/oppgavebehandling';
import { IMedunderskrivereParams } from '../../../../types/oppgavebehandling/params';

type SelectMedunderskriverProps = Pick<IOppgavebehandling, 'id' | 'ytelse' | 'medunderskriver' | 'type'>;

const NONE_SELECTED = 'NONE_SELECTED';

export const SelectMedunderskriver = ({ ytelse, id: oppgaveId, medunderskriver }: SelectMedunderskriverProps) => {
  const { data: oppgave } = useOppgave();
  const { data: bruker } = useUser();
  const canEdit = useCanEdit();
  const [updateChosenMedunderskriver] = useUpdateChosenMedunderskriverMutation({ fixedCacheKey: oppgaveId });

  const medunderskrivereQuery: IMedunderskrivereParams | typeof skipToken =
    typeof bruker === 'undefined' || typeof oppgave === 'undefined' || oppgave.tildeltSaksbehandlerEnhet === null
      ? skipToken
      : {
          navIdent: bruker.navIdent,
          enhet: oppgave.tildeltSaksbehandlerEnhet,
          ytelseId: ytelse,
          fnr: oppgave.sakenGjelder.person?.foedselsnummer ?? null,
        };

  const { data } = useSearchMedunderskrivereQuery(medunderskrivereQuery);

  if (!canEdit) {
    return null;
  }

  if (typeof data === 'undefined') {
    return <Loader size="xlarge" />;
  }

  const { medunderskrivere } = data;

  if (medunderskrivere.length === 0) {
    return <p>Fant ingen medunderskrivere</p>;
  }

  const onChangeChosenMedunderskriver = (medunderskriverident: string | null) =>
    updateChosenMedunderskriver({
      oppgaveId,
      medunderskriver:
        medunderskriverident === null
          ? null
          : medunderskrivere
              .map<ISaksbehandler>(({ navIdent, navn }) => ({ navIdent, navn }))
              .find(({ navIdent }) => navIdent === medunderskriverident) ?? null,
    });

  return (
    <Select
      disabled={!canEdit}
      label="Medunderskriver:"
      onChange={({ target }) => onChangeChosenMedunderskriver(target.value === NONE_SELECTED ? null : target.value)}
      value={medunderskriver?.navIdent ?? NONE_SELECTED}
      data-testid="select-medunderskriver"
    >
      <option value={NONE_SELECTED}>Ingen medunderskriver</option>
      {medunderskrivere.map(({ navn, navIdent }) => (
        <option key={navIdent} value={navIdent}>
          {navn}
        </option>
      ))}
    </Select>
  );
};
