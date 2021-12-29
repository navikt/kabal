import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { Select } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useGetBrukerQuery } from '../../../../redux-api/bruker';
import {
  useGetMedunderskrivereQuery,
  useUpdateChosenMedunderskriverMutation,
} from '../../../../redux-api/oppgavebehandling';
import { ISaksbehandler } from '../../../../redux-api/oppgavebehandling-common-types';
import { IMedunderskrivereParams } from '../../../../redux-api/oppgavebehandling-params-types';
import { IOppgavebehandling } from '../../../../redux-api/oppgavebehandling-types';

type SelectMedunderskriverProps = Pick<IOppgavebehandling, 'id' | 'ytelse' | 'medunderskriver' | 'type'>;

const NONE_SELECTED = 'NONE_SELECTED';

export const SelectMedunderskriver = ({ type, ytelse, id: oppgaveId, medunderskriver }: SelectMedunderskriverProps) => {
  const { data: bruker } = useGetBrukerQuery();
  const canEdit = useCanEdit();
  const [updateChosenMedunderskriver] = useUpdateChosenMedunderskriverMutation();

  const medunderskrivereQuery: IMedunderskrivereParams | typeof skipToken =
    typeof bruker === 'undefined'
      ? skipToken
      : {
          navIdent: bruker.info.navIdent,
          enhet: bruker.valgtEnhetView.id,
          ytelseId: ytelse,
          type,
        };

  const { data } = useGetMedunderskrivereQuery(medunderskrivereQuery);

  if (!canEdit) {
    return null;
  }

  if (typeof data === 'undefined') {
    return <NavFrontendSpinner />;
  }

  const { medunderskrivere } = data;

  if (medunderskrivere.length === 0) {
    return <p>Fant ingen medunderskrivere</p>;
  }

  const onChangeChosenMedunderskriver = (medunderskriverident: string | null) =>
    updateChosenMedunderskriver({
      oppgaveId,
      type,
      medunderskriver:
        medunderskriverident === null
          ? null
          : medunderskrivere
              .map<ISaksbehandler>(({ ident, navn }) => ({ navIdent: ident, navn }))
              .find(({ navIdent }) => navIdent === medunderskriverident) ?? null,
    });

  return (
    <StyledFormSection>
      <Select
        disabled={!canEdit}
        label="Medunderskriver:"
        onChange={({ target }) => onChangeChosenMedunderskriver(target.value === NONE_SELECTED ? null : target.value)}
        value={medunderskriver?.navIdent ?? NONE_SELECTED}
        data-testid="select-medunderskriver"
      >
        <option value={NONE_SELECTED}>Ingen medunderskriver</option>
        {medunderskrivere.map(({ navn, ident }) => (
          <option key={ident} value={ident}>
            {navn}
          </option>
        ))}
      </Select>
    </StyledFormSection>
  );
};

const StyledFormSection = styled.div`
  margin-top: 20px;
  width: 250px;
`;
