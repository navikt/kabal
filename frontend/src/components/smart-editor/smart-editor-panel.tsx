import { Behandlingsdetaljer } from '@app/components/behandling/behandling';
import { Behandlingsdialog } from '@app/components/behandling/behandlingsdialog/behandlingsdialog';
import { PanelContainer } from '@app/components/oppgavebehandling-panels/panel-container';
import { useFocusPanelShortcut } from '@app/components/oppgavebehandling-panels/panel-shortcuts-context';
import { TabbedEditors } from '@app/components/smart-editor/tabbed-editors/tabbed-editors';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorEnabled } from '@app/hooks/settings/use-setting';

const WIDTH = '450px';

export const SmartEditorPanel = () => {
  const { value: shown = true } = useSmartEditorEnabled();
  const { data: oppgave } = useOppgave();

  if (!shown || oppgave === undefined || oppgave.feilregistrering !== null) {
    return null;
  }

  return (
    <>
      <TabbedEditors />

      <PanelContainer data-testid="behandling-panel" minWidth={WIDTH} maxWidth={WIDTH}>
        <BehandlingPanelContent />
      </PanelContainer>

      <PanelContainer data-testid="behandlingsdialog-panel" minWidth={WIDTH} maxWidth={WIDTH}>
        <BehandlingsdialogPanelContent />
      </PanelContainer>
    </>
  );
};

const BehandlingPanelContent = () => {
  useFocusPanelShortcut(4);

  return <Behandlingsdetaljer />;
};

const BehandlingsdialogPanelContent = () => {
  useFocusPanelShortcut(5);

  return <Behandlingsdialog />;
};
