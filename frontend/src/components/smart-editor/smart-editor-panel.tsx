import { Behandlingsdetaljer } from '@app/components/behandling/behandling';
import { Behandlingsdialog } from '@app/components/behandling/behandlingsdialog/behandlingsdialog';
import { usePanelShortcut } from '@app/components/oppgavebehandling-panels/panel-shortcuts-context';
import { PanelContainer } from '@app/components/oppgavebehandling-panels/styled-components';
import { TabbedEditors } from '@app/components/smart-editor/tabbed-editors/tabbed-editors';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorEnabled } from '@app/hooks/settings/use-setting';
import { useCallback, useRef } from 'react';

export const SmartEditorPanel = () => {
  const { value: shown = true } = useSmartEditorEnabled();
  const { data: oppgave } = useOppgave();

  const behandlingRef = useRef<HTMLElement>(null);
  const behandlingsdialogRef = useRef<HTMLElement>(null);

  const focusBehandling = useCallback(() => behandlingRef.current?.focus(), []);
  const focusBehandlingsdialog = useCallback(() => behandlingsdialogRef.current?.focus(), []);

  const hide = !shown || oppgave === undefined || oppgave.feilregistrering !== null;

  usePanelShortcut(4, hide ? null : focusBehandling);
  usePanelShortcut(5, hide ? null : focusBehandlingsdialog);

  if (hide) {
    return null;
  }

  return (
    <>
      <TabbedEditors />

      <PanelContainer
        ref={behandlingRef}
        tabIndex={-1}
        data-testid="behandling-panel"
        minWidth="400px"
        maxWidth="400px"
      >
        <Behandlingsdetaljer />
      </PanelContainer>

      <PanelContainer
        ref={behandlingsdialogRef}
        tabIndex={-1}
        data-testid="behandlingsdialog-panel"
        minWidth="400px"
        maxWidth="400px"
      >
        <Behandlingsdialog />
      </PanelContainer>
    </>
  );
};
