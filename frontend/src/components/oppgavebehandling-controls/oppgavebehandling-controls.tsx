import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { BoxNew, HStack } from '@navikt/ds-react';
import { AaRegisteret, Ainntekt, KunnskapsbankTrygdemedisin, Modia } from './external-links';
import { PanelSwitches } from './panel-switches';
import { UserInfo } from './user-info';

export const OppgavebehandlingControls = () => (
  <HStack asChild gap="2 4" paddingInline="4" paddingBlock="2" wrap data-testid="behandling-control-panel">
    <BoxNew background="default" borderWidth="0 0 1 0" borderColor="neutral" as="header">
      <Content />
    </BoxNew>
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
      <HStack align="center" marginInline="auto 0" gap="0 4">
        <KunnskapsbankTrygdemedisin />
        <Modia sakenGjelder={sakenGjelder} />
        <AaRegisteret />
        <Ainntekt />
      </HStack>
    </>
  );
};
