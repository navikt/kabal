import React from 'react';
import { Behandling } from '../behandling/behandling';
import { Documents } from '../documents/documents';
import { Kvalitetsvurdering } from '../kvalitetsvurdering/kvalitetsvurdering';
import { PanelToggles } from '../oppgavebehandling/types';
import { SmartEditorPanel } from '../smart-editor/smart-editor-panel';
import { PageContainer } from './styled-components';

interface OppgavebehandlingPanelsProps {
  toggles: PanelToggles;
  switches: PanelToggles;
}

export const OppgavebehandlingPanels = ({ toggles, switches }: OppgavebehandlingPanelsProps): JSX.Element => (
  <PageContainer>
    <Documents shown={switches.documents && toggles.documents} />
    <SmartEditorPanel shown={switches.smartEditor && toggles.smartEditor} />
    <Behandling shown={switches.behandling && toggles.behandling} />
    <Kvalitetsvurdering shown={switches.kvalitetsvurdering && toggles.kvalitetsvurdering} />
  </PageContainer>
);
