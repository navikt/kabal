import { Box, HStack } from '@navikt/ds-react';
import { Documents } from '../documents/documents';
import { Kvalitetsvurdering } from '../kvalitetsvurdering/kvalitetsvurdering';
import { SmartEditorPanel } from '../smart-editor/smart-editor-panel';

export const OppgavebehandlingPanels = (): React.JSX.Element => (
  <HStack
    asChild
    gap="space-0 space-12"
    paddingBlock="space-8 space-12"
    paddingInline="space-8"
    width="100%"
    flexGrow="1"
    wrap={false}
  >
    <Box background="neutral-soft" overflowX="scroll" overflowY="hidden" as="main">
      <Documents />
      <SmartEditorPanel />
      <Kvalitetsvurdering />
    </Box>
  </HStack>
);
