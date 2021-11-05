import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import styled from 'styled-components';
import { useKlagebehandling } from '../../hooks/use-klagebehandling';
import { useGetFeatureTogglingEditorQuery } from '../../redux-api/feature-toggling';
import { PanelContainer } from '../klagebehandling-panels/panel';
import { CommentSection } from './comments/comment-section';
import { SmartEditorContextComponent } from './context/smart-editor-context';
import { Header } from './header/header';
import { SmartEditor } from './smart-editor';

export interface Props {
  shown: boolean;
}

export const SmartEditorPanel = ({ shown }: Props) => {
  const { data: featureTogglingEditor } = useGetFeatureTogglingEditorQuery();
  const [klagebehandling, isLoading] = useKlagebehandling();

  if (!shown || featureTogglingEditor === false) {
    return null;
  }

  if (typeof klagebehandling === 'undefined' || isLoading) {
    return (
      <PanelContainer data-testid="smart-editor-panel">
        <Header />
        <SmartEditorPanelContainer>
          <NavFrontendSpinner />
        </SmartEditorPanelContainer>
      </PanelContainer>
    );
  }

  return (
    <PanelContainer data-testid="smart-editor-panel">
      <Header />
      <SmartEditorPanelContainer>
        <SmartEditorContextComponent>
          <SmartEditor />
          <CommentSection />
        </SmartEditorContextComponent>
      </SmartEditorPanelContainer>
    </PanelContainer>
  );
};

const SmartEditorPanelContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 2em;
  min-width: 850px;
  height: calc(100% - 48px);
`;