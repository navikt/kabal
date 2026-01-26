import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { Box, HStack } from '@navikt/ds-react';
import { AaRegisteret, Ainntekt, KunnskapsbankTrygdemedisin, Modia } from './external-links';
import { PanelSwitches } from './panel-switches';
import { UserInfo } from './user-info';

export const OppgavebehandlingControls = () => (
  <HStack
    asChild
    gap="space-8 space-16"
    paddingInline="space-16"
    paddingBlock="space-8"
    wrap
    data-testid="behandling-control-panel"
  >
    <Box background="default" borderWidth="0 0 1 0" borderColor="neutral" as="header">
      <Content />
    </Box>
  </HStack>
);

const Content = () => {
  const { data: oppgave } = useOppgave();

  if (oppgave === undefined) {
    return 'Laster...';
  }

  const { sakenGjelder } = oppgave;
  return (
    <>
      <UserInfo {...oppgave} />
      <PanelSwitches />
      <HStack align="center" marginInline="auto space-0" gap="space-0 space-16">
        <KunnskapsbankTrygdemedisin />
        <Modia sakenGjelder={sakenGjelder} />
        <AaRegisteret />
        <Ainntekt />
      </HStack>
    </>
  );
};
