import { Switch } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { useHideKvalitetsvurdering } from '@app/components/oppgavebehandling-controls/use-hide-kvalitetsvurdering';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import {
  useBehandlingEnabled,
  useDocumentsEnabled,
  useKvalitetsvurderingEnabled,
  useSmartEditorEnabled,
} from '@app/hooks/settings/use-setting';

export const PanelSwitches = () => {
  const {
    value: documentsEnabled = true,
    setValue: setDocumentsEnabled,
    isLoading: documentsLoading,
  } = useDocumentsEnabled();

  const {
    value: behandlingEnabled = true,
    setValue: setBehandlingEnabled,
    isLoading: behandlingLoading,
  } = useBehandlingEnabled();

  return (
    <Container data-testid="behandling-panel-switches">
      <TogglePanelButton
        checked={documentsEnabled}
        loading={documentsLoading}
        togglePanel={() => setDocumentsEnabled(!documentsEnabled)}
        testId="panel-switch-documents"
      >
        Dokumenter
      </TogglePanelButton>
      <Brevutforming />
      <TogglePanelButton
        checked={behandlingEnabled}
        loading={behandlingLoading}
        togglePanel={() => setBehandlingEnabled(!behandlingEnabled)}
        testId="panel-switch-behandling"
      >
        Behandling
      </TogglePanelButton>
      <Kvalitetsvurdering />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: inherit;
`;

const Brevutforming = () => {
  const {
    value: smartEditorEnabled = true,
    setValue: setSmartEditorEnabled,
    isLoading: smartEditorLoading,
  } = useSmartEditorEnabled();

  const { data: oppgave, isLoading } = useOppgave();

  if (isLoading || typeof oppgave === 'undefined' || oppgave.feilregistrering !== null) {
    return null;
  }

  return (
    <TogglePanelButton
      checked={smartEditorEnabled}
      loading={smartEditorLoading}
      togglePanel={() => setSmartEditorEnabled(!smartEditorEnabled)}
      testId="panel-switch-smart-editor"
    >
      Brevutforming
    </TogglePanelButton>
  );
};

const Kvalitetsvurdering = () => {
  const { value = true, setValue, isLoading } = useKvalitetsvurderingEnabled();
  const hideKvalitetsvurdering = useHideKvalitetsvurdering();

  if (hideKvalitetsvurdering) {
    return null;
  }

  return (
    <TogglePanelButton
      checked={value}
      loading={isLoading}
      togglePanel={() => setValue(!value)}
      testId="panel-switch-kvalitetsvurdering"
    >
      Kvalitetsvurdering
    </TogglePanelButton>
  );
};

interface TogglePanelButtonProps {
  togglePanel: () => void;
  checked: boolean;
  loading: boolean;
  children: string;
  testId?: string;
}

const TogglePanelButton = ({ togglePanel, children, checked, loading, testId }: TogglePanelButtonProps) => (
  <Switch checked={checked} size="small" onChange={togglePanel} loading={loading} data-testid={testId}>
    {children}
  </Switch>
);
