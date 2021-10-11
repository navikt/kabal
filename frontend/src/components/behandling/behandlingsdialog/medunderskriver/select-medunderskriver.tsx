import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { Select } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useKlagebehandlingId } from '../../../../hooks/use-klagebehandling-id';
import { useGetBrukerQuery } from '../../../../redux-api/bruker';
import { useGetMedunderskrivereQuery, useUpdateChosenMedunderskriverMutation } from '../../../../redux-api/oppgave';
import { IKlagebehandling } from '../../../../redux-api/oppgave-state-types';

interface SelectMedunderskriverProps {
  klagebehandling: IKlagebehandling;
}

const NONE_SELECTED = 'NONE_SELECTED';

export const SelectMedunderskriver = ({ klagebehandling }: SelectMedunderskriverProps) => {
  const { data: bruker } = useGetBrukerQuery();
  const klagebehandlingId = useKlagebehandlingId();
  const canEdit = useCanEdit(klagebehandlingId);
  const [updateChosenMedunderskriver] = useUpdateChosenMedunderskriverMutation();

  const medunderskrivereQuery =
    typeof bruker === 'undefined'
      ? skipToken
      : {
          id: bruker.info.navIdent,
          tema: klagebehandling.tema,
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
      klagebehandlingId: klagebehandling.id,
      medunderskriverident,
    });

  const { medunderskriverident } = klagebehandling;

  return (
    <StyledFormSection>
      <Select
        disabled={!canEdit}
        label="Medunderskriver:"
        onChange={({ target }) => onChangeChosenMedunderskriver(target.value === NONE_SELECTED ? null : target.value)}
        value={medunderskrivere.find(({ ident }) => ident === medunderskriverident)?.ident}
      >
        <option value={NONE_SELECTED}>Ingen medunderskriver</option>
        {medunderskrivere.map((medunderskriver) => (
          <option key={medunderskriver.ident} value={medunderskriver.ident}>
            {medunderskriver.navn}
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
