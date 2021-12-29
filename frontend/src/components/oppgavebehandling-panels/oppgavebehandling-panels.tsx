import React from 'react';
import styled from 'styled-components';
import { Behandling } from '../behandling/behandling';
import { Dokumenter } from '../dokumenter/dokumenter';
import { PanelToggles } from '../klagebehandling/types';
import { Kvalitetsvurdering } from '../kvalitetsvurdering/kvalitetsvurdering';
import { SmartEditorPanel } from '../smart-editor/smart-editor-panel';

interface OppgavebehandlingPanelsProps {
  toggles: PanelToggles;
}

export const OppgavebehandlingPanels = ({ toggles }: OppgavebehandlingPanelsProps): JSX.Element => (
  <PageContainer data-testid="klagebehandling-panels">
    <Dokumenter shown={toggles.documents} />
    <SmartEditorPanel shown={toggles.smartEditor} />
    <Behandling shown={toggles.behandling} />
    <Kvalitetsvurdering shown={toggles.kvalitetsvurdering} />
  </PageContainer>
);

const PageContainer = styled.main`
  display: flex;
  width: 100%;
  margin: 0 0.25em 0 0;
  height: calc(100vh - 9em);
  overflow-x: scroll;
  overflow-y: hidden;
  padding-bottom: 1em;
  padding-left: 8px;
  padding-right: 8px;
  background-color: #e5e5e5;

  @media screen and (max-width: 1400px) {
    height: calc(100vh - 6.25em);
  }
`;
