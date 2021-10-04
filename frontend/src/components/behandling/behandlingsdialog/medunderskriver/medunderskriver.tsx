import { Hovedknapp } from 'nav-frontend-knapper';
import { Select } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import styled from 'styled-components';
import { IUserData } from '../../../../redux-api/bruker';
import {
  IMedunderskriver,
  useGetMedunderskrivereQuery,
  useUpdateChosenMedunderskriverMutation,
} from '../../../../redux-api/medunderskrivere';
import { IKlagebehandling } from '../../../../redux-api/oppgave-state-types';

interface MedunderskriverProps {
  klagebehandling: IKlagebehandling;
  bruker: IUserData;
}

export const Medunderskriver = ({ klagebehandling, bruker }: MedunderskriverProps): JSX.Element => {
  const medunderskrivereQuery = {
    id: bruker.info.navIdent,
    tema: klagebehandling.tema,
  };

  const { data: medunderskrivereData } = useGetMedunderskrivereQuery(medunderskrivereQuery);
  const [updateChosenMedunderskriver] = useUpdateChosenMedunderskriverMutation();

  if (typeof medunderskrivereData === 'undefined') {
    return <NavFrontendSpinner />;
  }

  if (medunderskrivereData.medunderskrivere.length === 0) {
    return <p>Fant ingen medunderskrivere</p>;
  }

  const onChangeChosenMedunderskriver = (medunderskriverident: string) => {
    const { id, klagebehandlingVersjon } = klagebehandling;
    const queryObj = {
      klagebehandlingId: id,
      klagebehandlingVersjon,
      medunderskriverident,
    };

    updateChosenMedunderskriver(queryObj);
  };

  return (
    <>
      <SelectMedunderskriver
        medunderskrivere={medunderskrivereData.medunderskrivere}
        onChangeChosenMedunderskriver={onChangeChosenMedunderskriver}
      />
      <ActionButton />
    </>
  );
};

interface SelectMedunderskriverProps {
  medunderskrivere: IMedunderskriver[];
  onChangeChosenMedunderskriver: (medunderskriverident: string) => void;
}

const SelectMedunderskriver = ({ medunderskrivere, onChangeChosenMedunderskriver }: SelectMedunderskriverProps) => (
  <StyledFormSection>
    <Select label="Medunderskriver:" onChange={(e) => onChangeChosenMedunderskriver(e.target.value)}>
      {medunderskrivere.map((medunderskriver) => (
        <option key={medunderskriver.ident} value={medunderskriver.ident}>
          {medunderskriver.navn}
        </option>
      ))}
    </Select>
  </StyledFormSection>
);

const ActionButton = () => (
  <StyledFormSection>
    <Hovedknapp>Send til medunderskriver</Hovedknapp>
  </StyledFormSection>
);

const StyledFormSection = styled.div`
  margin-top: 20px;
`;
