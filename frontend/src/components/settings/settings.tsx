import { PdfScale } from '@app/components/settings/pdf-scale/pdf-scale';
import { VStack } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { Abbreviations } from './abbreviations/abbreviations';
import { Filters } from './filters';
import { Signature } from './signature';

export const Settings = () => (
  <VStack gap="4">
    <PdfScale />

    <StyledSettings>
      <Filters />

      <VStack gap="4" gridColumn="other">
        <Abbreviations />
        <Signature />
      </VStack>
    </StyledSettings>
  </VStack>
);

const StyledSettings = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(1030px, 1fr);
  grid-template-rows: min-content;
  grid-template-areas: 'filters other';
  gap: var(--a-spacing-4);
  align-items: start;
  width: 100%;

  @media (max-width: 1775px) {
    display: flex;
    flex-direction: column;
    align-items: normal;
  }
`;
