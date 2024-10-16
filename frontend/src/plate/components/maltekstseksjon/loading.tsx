import { MALTEKST_SECTION_NAMES } from '@app/components/smart-editor/constants';
import type { TemplateSections } from '@app/plate/template-sections';
import { Alert, Heading, Loader } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  section: TemplateSections;
}

export const Loading = ({ section }: Props) => (
  <StyledAlert size="small" variant="info">
    <Heading size="xsmall" level="1">
      {MALTEKST_SECTION_NAMES[section]}
    </Heading>
    <AlertContent>
      <Loader size="xsmall" /> Laster tekst...
    </AlertContent>
  </StyledAlert>
);

const StyledAlert = styled(Alert)`
  margin-top: 1em;
  margin-bottom: 1em;
`;

const AlertContent = styled.div`
  display: flex;
  align-items: center;
  gap: var(--a-spacing-1);
`;
