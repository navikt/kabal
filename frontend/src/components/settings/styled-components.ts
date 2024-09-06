import { Fieldset } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const SettingsSection = styled.section<{ $area: string }>`
  grid-area: ${({ $area }) => $area};
  box-shadow: var(--a-shadow-medium);
  border-radius: var(--a-border-radius-medium);
  width: fit-content;
  padding: var(--a-spacing-6);
  width: 100%;
  height: fit-content;
  background-color: var(--a-bg-subtle);
`;

export const SectionHeader = styled.h1`
  font-size: var(--a-spacing-6);
  margin: 0;
  margin-bottom: var(--a-spacing-6);
  display: flex;
  align-items: center;
  gap: var(--a-spacing-2);
`;

export const StyledFilters = styled.div`
  display: flex;
  gap: var(--a-spacing-5);
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
  column-gap: var(--a-spacing-2);
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
`;
