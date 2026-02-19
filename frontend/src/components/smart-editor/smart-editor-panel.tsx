import { Behandlingsdetaljer } from '@app/components/behandling/behandling';
import { Behandlingsdialog } from '@app/components/behandling/behandlingsdialog/behandlingsdialog';
import { PanelContainer } from '@app/components/oppgavebehandling-panels/styled-components';
import { TabbedEditors } from '@app/components/smart-editor/tabbed-editors/tabbed-editors';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorEnabled } from '@app/hooks/settings/use-setting';

export const SmartEditorPanel = () => {
  const { value: shown = true } = useSmartEditorEnabled();
  const { data: oppgave } = useOppgave();

  const hide = !shown || oppgave === undefined || oppgave.feilregistrering !== null;

  if (hide) {
    return null;
  }

  return (
    <>
      <TabbedEditors />

      <PanelContainer data-testid="behandling-panel" minWidth="400px" maxWidth="400px">
        <Behandlingsdetaljer />
      </PanelContainer>

      <PanelContainer data-testid="behandlingsdialog-panel" minWidth="400px" maxWidth="400px">
        <Behandlingsdialog />
      </PanelContainer>
    </>
  );
};
