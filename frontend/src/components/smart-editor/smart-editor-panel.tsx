import React from 'react';
import styled from 'styled-components';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorEnabled } from '@app/hooks/settings/use-setting';
import { PanelContainer } from '../oppgavebehandling-panels/styled-components';
import { TabbedEditors } from './tabbed-editors/tabbed-editors';

export const SmartEditorPanel = () => {
  const { value: shown = true, isLoading } = useSmartEditorEnabled();
  const { data: oppgave } = useOppgave();

  const hide = !shown || isLoading || typeof oppgave === 'undefined' || oppgave.feilregistrering !== null;

  if (hide) {
    return null;
  }

  return (
    <PanelContainer data-testid="smart-editor-panel">
      <SmartEditorPanelContainer>
        <TabbedEditors />
      </SmartEditorPanelContainer>
    </PanelContainer>
  );
};

const SmartEditorPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  min-width: 210mm;
  min-height: 100%;
`;
