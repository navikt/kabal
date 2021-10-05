import { Select } from 'nav-frontend-skjema';
import React from 'react';
import styled from 'styled-components';
import { IMedunderskriver } from '../../../../redux-api/medunderskrivere';

interface SelectMedunderskriverProps {
  medunderskrivere: IMedunderskriver[];
  onChangeChosenMedunderskriver: (medunderskriverident: string) => void;
  sentToMedunderskriverNavIdent: string | null;
}

export const SelectMedunderskriver = ({
  medunderskrivere,
  onChangeChosenMedunderskriver,
  sentToMedunderskriverNavIdent,
}: SelectMedunderskriverProps) => (
  //   const sentToMedunderskriverIndex = medunderskrivere.findIndex(
  //     (medunderskriver: IMedunderskriver) => medunderskriver.ident === sentToMedunderskriverNavIdent
  //   );

  <StyledFormSection>
    <Select
      label="Medunderskriver:"
      selected={sentToMedunderskriverNavIdent ?? undefined}
      onChange={(e) => onChangeChosenMedunderskriver(e.target.value)}
    >
      {medunderskrivere.map((medunderskriver) => (
        <option key={medunderskriver.ident} value={medunderskriver.ident}>
          {medunderskriver.navn}
        </option>
      ))}
    </Select>
  </StyledFormSection>
);

const StyledFormSection = styled.div`
  margin-top: 20px;
`;
