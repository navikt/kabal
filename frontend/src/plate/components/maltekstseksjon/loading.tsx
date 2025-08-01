import { MALTEKST_SECTION_NAMES } from '@app/components/smart-editor/constants';
import type { TemplateSections } from '@app/plate/template-sections';
import { Alert, Heading, HStack, Loader } from '@navikt/ds-react';

interface Props {
  section: TemplateSections;
}

export const Loading = ({ section }: Props) => (
  <Alert size="small" variant="info" className="my-4">
    <Heading size="xsmall" level="1">
      {MALTEKST_SECTION_NAMES[section]}
    </Heading>
    <HStack align="center" gap="1">
      <Loader size="xsmall" /> Laster tekst...
    </HStack>
  </Alert>
);
