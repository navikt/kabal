import { HStack, Switch } from '@navikt/ds-react';
import { useKvalitetsvurderingSupported } from '@/components/oppgavebehandling-controls/use-hide-kvalitetsvurdering';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useDocumentsEnabled, useKvalitetsvurderingEnabled, useSmartEditorEnabled } from '@/hooks/settings/use-setting';
import { pushEvent } from '@/observability';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

export const PanelSwitches = () => {
  const { value: documentsEnabled = true, setValue: setDocumentsEnabled } = useDocumentsEnabled();

  return (
    <HStack gap="space-0 space-16" align="center">
      <TogglePanelButton
        checked={documentsEnabled}
        togglePanel={() => {
          const isEnabled = !documentsEnabled;
          pushEvent('toggle-documents-panel', 'panels', { enabled: isEnabled.toString() });
          setDocumentsEnabled(isEnabled);
        }}
      >
        Dokumenter
      </TogglePanelButton>
      <Brevutforming />
      <Kvalitetsvurdering />
    </HStack>
  );
};

const Brevutforming = () => {
  const { value: smartEditorEnabled = true, setValue: setSmartEditorEnabled } = useSmartEditorEnabled();

  const { data: oppgave, isLoading } = useOppgave();

  if (isLoading || typeof oppgave === 'undefined' || oppgave.feilregistrering !== null) {
    return null;
  }

  return (
    <TogglePanelButton
      checked={smartEditorEnabled}
      togglePanel={() => {
        const isEnabled = !smartEditorEnabled;
        pushEvent('toggle-smart-editor-panel', 'panels', { enabled: isEnabled.toString() });
        setSmartEditorEnabled(isEnabled);
      }}
    >
      Brevutforming og behandling
    </TogglePanelButton>
  );
};

const Kvalitetsvurdering = () => {
  const { data: oppgave } = useOppgave();

  return oppgave === undefined ? null : <KvalitetsvurderingLoaded oppgave={oppgave} />;
};

const KvalitetsvurderingLoaded = ({ oppgave }: { oppgave: IOppgavebehandling }) => {
  const { featureEnabled, panelDefaultEnabled } = useKvalitetsvurderingSupported(oppgave);
  const { value = panelDefaultEnabled, setValue } = useKvalitetsvurderingEnabled();

  if (!featureEnabled) {
    return null;
  }

  return (
    <TogglePanelButton
      checked={value}
      togglePanel={() => {
        const isEnabled = !value;
        pushEvent('toggle-kvalitetsvurdering-panel', 'panels', { enabled: isEnabled.toString() });
        setValue(isEnabled);
      }}
    >
      Kvalitetsvurdering
    </TogglePanelButton>
  );
};

interface TogglePanelButtonProps {
  togglePanel: () => void;
  checked: boolean;
  children: string;
}

const TogglePanelButton = ({ togglePanel, children, checked }: TogglePanelButtonProps) => (
  <Switch checked={checked} size="small" onChange={togglePanel}>
    {children}
  </Switch>
);
