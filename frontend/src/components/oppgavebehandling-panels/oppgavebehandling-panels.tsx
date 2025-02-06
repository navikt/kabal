import { Box, HStack } from '@navikt/ds-react';
import { Documents } from '../documents/documents';
import { Kvalitetsvurdering } from '../kvalitetsvurdering/kvalitetsvurdering';
import { SmartEditorPanel } from '../smart-editor/smart-editor-panel';

export const OppgavebehandlingPanels = (): JSX.Element => (
  <HStack asChild gap="0 3" paddingBlock="2 3" paddingInline="2" width="100%" flexGrow="1" wrap={false}>
    <Box background="bg-subtle" overflowX="scroll" overflowY="hidden" as="main">
      <Documents />
      <SmartEditorPanel />
      <Kvalitetsvurdering />
    </Box>
  </HStack>
);
