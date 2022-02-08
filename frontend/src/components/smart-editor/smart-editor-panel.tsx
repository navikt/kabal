import React from 'react';
import styled from 'styled-components';
import { FeatureToggles, useGetFeatureToggleQuery } from '../../redux-api/feature-toggling';
import { PanelContainer } from '../oppgavebehandling-panels/panel';
import { TabbedEditors } from './tabbed-editors';

export interface Props {
  shown: boolean;
}

export const SmartEditorPanel = ({ shown }: Props) => {
  const { data: featureTogglingEditor } = useGetFeatureToggleQuery(FeatureToggles.SMART_EDITOR);

  if (!shown || featureTogglingEditor === false) {
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
  padding: 0;
  width: 1300px;
  min-height: 100%;
`;
