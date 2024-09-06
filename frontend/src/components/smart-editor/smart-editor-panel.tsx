import { Behandling } from '@app/components/behandling/behandling';
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
      <Behandling />
    </>
  );
};
