import { styled } from 'styled-components';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { AaRegisteret, Ainntekt, Modia } from './external-links';
import { PanelSwitches } from './panel-switches';
import { UserInfo } from './user-info';

export const OppgavebehandlingControls = () => {
  const { data: oppgave } = useOppgave();

  if (typeof oppgave === 'undefined') {
    return <ControlPanel>Laster...</ControlPanel>;
  }

  const { sakenGjelder } = oppgave;

  return (
    <ControlPanel data-testid="behandling-control-panel">
      <UserInfo {...oppgave} />
      <PanelSwitches />
      <OppgavebehandlingInformation>
        <Modia sakenGjelder={sakenGjelder} />
        <AaRegisteret />
        <Ainntekt />
      </OppgavebehandlingInformation>
    </ControlPanel>
  );
};

const ControlPanel = styled.header`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: var(--a-spacing-4);
  row-gap: var(--a-spacing-2);
  padding: 0 var(--a-spacing-4);
  background-color: var(--a-bg-default);
  padding-top: var(--a-spacing-2);
  padding-bottom: var(--a-spacing-2);
  border-bottom: 1px solid var(--a-border-divider);
`;

const OppgavebehandlingInformation = styled.div`
  display: flex;
  align-items: center;
  column-gap: inherit;
  margin-left: auto;
`;
