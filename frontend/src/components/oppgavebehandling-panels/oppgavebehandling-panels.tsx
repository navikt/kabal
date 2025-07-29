import { BoxNew, HStack } from '@navikt/ds-react';
import { Documents } from '../documents/documents';
import { Kvalitetsvurdering } from '../kvalitetsvurdering/kvalitetsvurdering';
import { SmartEditorPanel } from '../smart-editor/smart-editor-panel';

export const OppgavebehandlingPanels = (): React.JSX.Element => (
  <HStack asChild gap="0 3" paddingBlock="2 3" paddingInline="2" width="100%" flexGrow="1" wrap={false}>
    <BoxNew background="neutral-soft" overflowX="scroll" overflowY="hidden" as="main">
      <Documents />
      <SmartEditorPanel />
      <Kvalitetsvurdering />
    </BoxNew>
  </HStack>
);
