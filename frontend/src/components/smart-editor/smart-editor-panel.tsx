import { withFaroProfiler } from '@grafana/faro-react';
import { Behandlingsdetaljer } from '@/components/behandling/behandling';
import { Behandlingsdialog } from '@/components/behandling/behandlingsdialog/behandlingsdialog';
import { PanelContainer } from '@/components/oppgavebehandling-panels/panel-container';
import { useFocusPanelShortcut } from '@/components/oppgavebehandling-panels/panel-shortcuts-context';
import { TabbedEditors } from '@/components/smart-editor/tabbed-editors/tabbed-editors';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorEnabled } from '@/hooks/settings/use-setting';

const WIDTH = '450px';

const SmartEditorPanelComponent = () => {
  const { value: shown = true } = useSmartEditorEnabled();
  const { data: oppgave } = useOppgave();

  if (!shown || oppgave === undefined || oppgave.feilregistrering !== null) {
    return null;
  }

  return (
    <>
      <TabbedEditors />

      <PanelContainer heading="Behandling" minWidth={WIDTH} maxWidth={WIDTH}>
        <BehandlingPanelContent />
      </PanelContainer>

      <PanelContainer heading="Behandlingsdialog" minWidth={WIDTH} maxWidth={WIDTH}>
        <BehandlingsdialogPanelContent />
      </PanelContainer>
    </>
  );
};

export const SmartEditorPanel = withFaroProfiler(SmartEditorPanelComponent);

const BehandlingPanelContent = () => {
  useFocusPanelShortcut(4);

  return <Behandlingsdetaljer />;
};

const BehandlingsdialogPanelContent = () => {
  useFocusPanelShortcut(5);

  return <Behandlingsdialog />;
};
