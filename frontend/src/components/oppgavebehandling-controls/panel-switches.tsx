import { useHideKvalitetsvurdering } from '@app/components/oppgavebehandling-controls/use-hide-kvalitetsvurdering';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import {
  useDocumentsEnabled,
  useKvalitetsvurderingEnabled,
  useSmartEditorEnabled,
} from '@app/hooks/settings/use-setting';
import { pushEvent } from '@app/observability';
import { HStack, Switch } from '@navikt/ds-react';

export const PanelSwitches = () => {
  const { value: documentsEnabled = true, setValue: setDocumentsEnabled } = useDocumentsEnabled();

  return (
    <HStack gap="0 4" data-testid="behandling-panel-switches" align="center">
      <TogglePanelButton
        checked={documentsEnabled}
        togglePanel={() => {
          const isEnabled = !documentsEnabled;
          pushEvent('toggle-documents-panel', 'panels', { enabled: isEnabled.toString() });
          setDocumentsEnabled(isEnabled);
        }}
        testId="panel-switch-documents"
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
      testId="panel-switch-smart-editor"
    >
      Brevutforming og behandling
    </TogglePanelButton>
  );
};

const Kvalitetsvurdering = () => {
  const { value = true, setValue } = useKvalitetsvurderingEnabled();
  const hideKvalitetsvurdering = useHideKvalitetsvurdering();

  if (hideKvalitetsvurdering) {
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
      testId="panel-switch-kvalitetsvurdering"
    >
      Kvalitetsvurdering
    </TogglePanelButton>
  );
};

interface TogglePanelButtonProps {
  togglePanel: () => void;
  checked: boolean;
  children: string;
  testId?: string;
}

const TogglePanelButton = ({ togglePanel, children, checked, testId }: TogglePanelButtonProps) => (
  <Switch checked={checked} size="small" onChange={togglePanel} data-testid={testId}>
    {children}
  </Switch>
);
