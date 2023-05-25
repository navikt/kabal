import { Switch } from '@navikt/ds-react';
import React from 'react';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import {
  useBehandlingEnabled,
  useDocumentsEnabled,
  useKvalitetsvurderingEnabled,
  useSmartEditorEnabled,
} from '@app/hooks/settings/use-setting';
import { SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';
import { ToggleButtonsContainer } from './styled-components';

export const PanelToggleButtons = () => {
  const {
    value: documentsEnabled = true,
    setValue: setDocumentsEnabled,
    isLoading: documentsLoading,
  } = useDocumentsEnabled();

  const {
    value: smartEditorEnabled = true,
    setValue: setSmartEditorEnabled,
    isLoading: smartEditorLoading,
  } = useSmartEditorEnabled();

  const {
    value: behandlingEnabled = true,
    setValue: setBehandlingEnabled,
    isLoading: behandlingLoading,
  } = useBehandlingEnabled();

  return (
    <ToggleButtonsContainer data-testid="klagebehandling-control-panel-toggle-buttons">
      <TogglePanelButton
        checked={documentsEnabled}
        loading={documentsLoading}
        togglePanel={() => setDocumentsEnabled(!documentsEnabled)}
        testId="klagebehandling-control-panel-toggle-documents"
      >
        Dokumenter
      </TogglePanelButton>
      <TogglePanelButton
        checked={smartEditorEnabled}
        loading={smartEditorLoading}
        togglePanel={() => setSmartEditorEnabled(!smartEditorEnabled)}
        testId="klagebehandling-control-panel-toggle-smart-editor"
      >
        Brevutforming
      </TogglePanelButton>
      <TogglePanelButton
        checked={behandlingEnabled}
        loading={behandlingLoading}
        togglePanel={() => setBehandlingEnabled(!behandlingEnabled)}
        testId="klagebehandling-control-panel-toggle-behandling"
      >
        Behandling
      </TogglePanelButton>
      <Kvalitetsvurdering />
    </ToggleButtonsContainer>
  );
};

const Kvalitetsvurdering = () => {
  const { value = true, setValue, isLoading } = useKvalitetsvurderingEnabled();

  const { data: oppgave } = useOppgave();

  if (typeof oppgave === 'undefined') {
    return null;
  }

  const { type, resultat } = oppgave;

  const hideKvalitetsvurdering =
    oppgave.kvalitetsvurderingReference === null ||
    type === SaksTypeEnum.ANKE_I_TRYGDERETTEN ||
    resultat.utfall === UtfallEnum.TRUKKET ||
    resultat.utfall === UtfallEnum.RETUR ||
    resultat.utfall === UtfallEnum.UGUNST;

  if (hideKvalitetsvurdering) {
    return null;
  }

  return (
    <TogglePanelButton
      checked={value}
      loading={isLoading}
      togglePanel={() => setValue(!value)}
      testId="klagebehandling-control-panel-toggle-kvalitetsvurdering"
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
