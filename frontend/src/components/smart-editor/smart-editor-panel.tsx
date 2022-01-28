import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import styled from 'styled-components';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { FeatureToggles, useGetFeatureToggleQuery } from '../../redux-api/feature-toggling';
import { PanelContainer } from '../oppgavebehandling-panels/panel';
import { CommentSection } from './comments/comment-section';
import { SmartEditorContextComponent } from './context/smart-editor-context';
import { Header } from './header/header';
import { SmartEditor } from './smart-editor';

export interface Props {
  shown: boolean;
}

export const SmartEditorPanel = ({ shown }: Props) => {
  const { data: featureTogglingEditor } = useGetFeatureToggleQuery(FeatureToggles.SMART_EDITOR);
  const { data: oppgavebehandling, isLoading } = useOppgave();

  if (!shown || featureTogglingEditor === false) {
    return null;
  }

  if (typeof oppgavebehandling === 'undefined' || isLoading) {
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
  width: 1100px;
  height: calc(100% - 48px);
`;
