import { MALTEKST_SECTION_NAMES } from '@app/components/smart-editor/constants';
import type { TemplateSections } from '@app/plate/template-sections';
import { Alert, HStack, Heading, Loader } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  section: TemplateSections;
}

export const Loading = ({ section }: Props) => (
  <StyledAlert size="small" variant="info">
    <Heading size="xsmall" level="1">
      {MALTEKST_SECTION_NAMES[section]}
    </Heading>
    <HStack align="center" gap="1">
      <Loader size="xsmall" /> Laster tekst...
    </HStack>
  </StyledAlert>
);

const StyledAlert = styled(Alert)`
  margin-top: 1em;
  margin-bottom: 1em;
`;
