import React from 'react';
import styled from 'styled-components';
import { useSmartEditorEnabled } from '@app/hooks/settings/use-setting';
import { PanelContainer } from '../oppgavebehandling-panels/styled-components';
import { TabbedEditors } from './tabbed-editors/tabbed-editors';

export const SmartEditorPanel = () => {
  const { value: shown = true, isLoading } = useSmartEditorEnabled();

  if (!shown || isLoading) {
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
