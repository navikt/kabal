import React from 'react';
import styled from 'styled-components';
import { Behandling } from '../behandling/behandling';
import { Brevutforming } from '../brevutforming/brevutforming';
import { Dokumenter } from '../dokumenter/dokumenter';
import { PanelToggles } from '../klagebehandling/types';
import { Kvalitetsvurdering } from '../kvalitetsvurdering/kvalitetsvurdering';

interface KlagebehandlingPanelsProps {
  toggles: PanelToggles;
}

export const KlagebehandlingPanels = ({ toggles }: KlagebehandlingPanelsProps): JSX.Element => (
  <PageContainer data-testid="klagebehandling-panels">
    <Dokumenter shown={toggles.documents} />
    <Brevutforming shown={toggles.brevutforming} />
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
