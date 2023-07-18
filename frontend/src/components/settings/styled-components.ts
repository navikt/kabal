import { Fieldset } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const SettingsSection = styled.section`
  box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 6px;
  border-radius: 4px;
  width: fit-content;
  padding: 24px;
  width: 100%;
  max-width: 1548px;
`;

export const SectionHeader = styled.h1`
  font-size: 24px;
  margin: 0%;
  margin-bottom: 24px;
`;

export const StyledFilters = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  flex-wrap: wrap;
`;

export const StyledFilterContainer = styled.section`
  position: relative;
  width: 100%;
  flex-shrink: 0;
`;

export const StyledFieldset = styled(Fieldset)`
  display: grid;
  grid-template-columns: repeat(auto-fit, 300px);
  width: 100%;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 8px;
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
`;
