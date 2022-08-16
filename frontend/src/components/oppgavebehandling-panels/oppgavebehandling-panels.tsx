import React from 'react';
import { Behandling } from '../behandling/behandling';
import { Documents } from '../documents/documents';
import { PanelToggles } from '../klagebehandling/types';
import { Kvalitetsvurdering } from '../kvalitetsvurdering/kvalitetsvurdering';
import { SmartEditorPanel } from '../smart-editor/smart-editor-panel';
import { PageContainer } from './styled-components';

interface OppgavebehandlingPanelsProps {
  toggles: PanelToggles;
}

export const OppgavebehandlingPanels = ({ toggles }: OppgavebehandlingPanelsProps): JSX.Element => (
  <PageContainer data-testid="klagebehandling-panels">
    <Documents shown={toggles.documents.showContent} />
    <SmartEditorPanel shown={toggles.smartEditor.showContent} />
    <Behandling shown={toggles.behandling.showContent} />
    <Kvalitetsvurdering shown={toggles.kvalitetsvurdering.showContent} />
  </PageContainer>
);
