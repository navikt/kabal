import React from 'react';
import { Behandling } from '../behandling/behandling';
import { Documents } from '../documents/documents';
import { PanelToggles } from '../klagebehandling/types';
import { PageContainer } from '../oppgavebehandling-panels/styled-components';
import { SmartEditorPanel } from '../smart-editor/smart-editor-panel';

interface OppgavebehandlingPanelsProps {
  toggles: PanelToggles;
}

export const TrygderettsankePanels = ({ toggles }: OppgavebehandlingPanelsProps): JSX.Element => (
  <PageContainer data-testid="trygderettsankebehandling-panels">
    <Documents shown={toggles.documents?.showContent ?? false} />
    <SmartEditorPanel shown={toggles.smartEditor?.showContent ?? false} />
    <Behandling shown={toggles.behandling?.showContent ?? false} />
  </PageContainer>
);
