import { Heading, HStack, Loader } from '@navikt/ds-react';
import { Alert } from '@/components/alert/alert';
import { MALTEKST_SECTION_NAMES } from '@/components/smart-editor/constants';
import type { TemplateSections } from '@/plate/template-sections';

interface Props {
  section: TemplateSections;
}

export const Loading = ({ section }: Props) => (
  <Alert variant="info" className="my-4">
    <Heading size="xsmall" level="1">
      {MALTEKST_SECTION_NAMES[section]}
    </Heading>
    <HStack align="center" gap="space-4">
      <Loader size="xsmall" /> Laster tekst...
    </HStack>
  </Alert>
);
