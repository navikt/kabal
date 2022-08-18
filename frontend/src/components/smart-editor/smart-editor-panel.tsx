import React from 'react';
import styled from 'styled-components';
import { PanelContainer } from '../oppgavebehandling-panels/styled-components';
import { TabbedEditors } from './tabbed-editors/tabbed-editors';

export interface Props {
  shown: boolean;
}

export const SmartEditorPanel = ({ shown }: Props) => {
  if (!shown) {
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
