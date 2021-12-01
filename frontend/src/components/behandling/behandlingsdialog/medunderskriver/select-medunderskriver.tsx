import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { Select } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useKlagebehandlingId } from '../../../../hooks/use-klagebehandling-id';
import { useGetBrukerQuery } from '../../../../redux-api/bruker';
import { useGetMedunderskrivereQuery, useUpdateChosenMedunderskriverMutation } from '../../../../redux-api/oppgave';
import { IKlagebehandling, ISaksbehandler } from '../../../../redux-api/oppgave-state-types';
import { IMedunderskriverResponse, IMedunderskrivereParams } from '../../../../redux-api/oppgave-types';

interface SelectMedunderskriverProps {
  klagebehandling: IKlagebehandling;
  medunderskriver: IMedunderskriverResponse;
}

const NONE_SELECTED = 'NONE_SELECTED';

export const SelectMedunderskriver = ({ klagebehandling, medunderskriver }: SelectMedunderskriverProps) => {
  const { data: bruker } = useGetBrukerQuery();
  const klagebehandlingId = useKlagebehandlingId();
  const canEdit = useCanEdit();
  const [updateChosenMedunderskriver, { isLoading }] = useUpdateChosenMedunderskriverMutation();

  const medunderskrivereQuery: IMedunderskrivereParams | typeof skipToken =
    typeof bruker === 'undefined'
      ? skipToken
      : {
          navIdent: bruker.info.navIdent,
          enhet: bruker.valgtEnhetView.id,
          ytelseId: klagebehandling.ytelse,
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
      klagebehandlingId,
      medunderskriver:
        medunderskriverident === null
          ? null
          : medunderskrivere
              .map<ISaksbehandler>(({ ident, navn }) => ({ navIdent: ident, navn })) // TODO: Remove mapping when backend is changed.
              .find(({ navIdent }) => navIdent === medunderskriverident) ?? null,
    });

  return (
    <StyledFormSection>
      <Select
        disabled={!canEdit || isLoading}
        label="Medunderskriver:"
        onChange={({ target }) => onChangeChosenMedunderskriver(target.value === NONE_SELECTED ? null : target.value)}
        value={medunderskriver.medunderskriver?.navIdent ?? NONE_SELECTED}
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
