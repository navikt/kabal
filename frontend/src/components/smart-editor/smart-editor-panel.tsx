import React from 'react';
import { styled } from 'styled-components';
import { Behandling } from '@app/components/behandling/behandling';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorEnabled } from '@app/hooks/settings/use-setting';
import { PanelContainer } from '../oppgavebehandling-panels/styled-components';
import { TabbedEditors } from './tabbed-editors/tabbed-editors';

export const SmartEditorPanel = () => {
  const { value: shown = true } = useSmartEditorEnabled();
  const { data: oppgave } = useOppgave();

  const hide = !shown || typeof oppgave === 'undefined' || oppgave.feilregistrering !== null;

  if (hide) {
    return null;
  }

  return (
    <StyledPanelContainer data-testid="smart-editor-panel">
      <SmartEditorContainer>
        <TabbedEditors />
        <Behandling />
      </SmartEditorContainer>
    </StyledPanelContainer>
  );
};

const SmartEditorContainer = styled.div`
  display: flex;
  gap: 16px;
  padding: 0;
  min-height: 100%;
  overflow: hidden;
`;

const StyledPanelContainer = styled(PanelContainer)`
  background: transparent;
`;
