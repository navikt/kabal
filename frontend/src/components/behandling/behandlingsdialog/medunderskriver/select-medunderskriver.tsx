import { Select } from 'nav-frontend-skjema';
import React from 'react';
import styled from 'styled-components';
import { IMedunderskriver } from '../../../../redux-api/medunderskrivere';

interface SelectMedunderskriverProps {
  medunderskrivere: IMedunderskriver[];
  onChangeChosenMedunderskriver: (medunderskriverident: string | null) => void;
  selectedMedunderskriverNavIdent: string | null;
}

const NONE_SELECTED = 'NONE_SELECTED';

export const SelectMedunderskriver = ({
  medunderskrivere,
  onChangeChosenMedunderskriver,
  selectedMedunderskriverNavIdent,
}: SelectMedunderskriverProps) => (
  <StyledFormSection>
    <Select
      label="Medunderskriver:"
      onChange={({ target }) => onChangeChosenMedunderskriver(target.value === NONE_SELECTED ? null : target.value)}
      value={medunderskrivere.find(({ ident }) => ident === selectedMedunderskriverNavIdent)?.ident}
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

const StyledFormSection = styled.div`
  margin-top: 20px;
`;
