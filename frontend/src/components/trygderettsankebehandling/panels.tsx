import React from 'react';
import { Behandling } from '../behandling/behandling';
import { Documents } from '../documents/documents';
import { PanelToggles } from '../klagebehandling/types';
import { PageContainer } from '../oppgavebehandling-panels/styled-components';
import { SmartEditorPanel } from '../smart-editor/smart-editor-panel';

interface OppgavebehandlingPanelsProps {
  toggles: PanelToggles;
}

export const Panels = ({ toggles }: OppgavebehandlingPanelsProps): JSX.Element => (
  <PageContainer data-testid="trygderettsankebehandling-panels">
    <Documents shown={toggles.documents.showContent} />
    <SmartEditorPanel shown={toggles.smartEditor.showContent} />
    <Behandling shown={toggles.behandling.showContent} />
  </PageContainer>
);
