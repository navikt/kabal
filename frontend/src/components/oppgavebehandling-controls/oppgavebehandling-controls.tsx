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
  column-gap: 16px;
  row-gap: 8px;
  padding: 0 16px;
  background-color: #f8f8f8;
  padding-top: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #c9c9c9;
`;

const OppgavebehandlingInformation = styled.div`
  display: flex;
  align-items: center;
  column-gap: inherit;
  margin-left: auto;
`;
