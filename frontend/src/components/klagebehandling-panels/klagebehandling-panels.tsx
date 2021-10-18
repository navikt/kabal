import React from 'react';
import styled from 'styled-components';
import { useGetFeatureTogglingEditorQuery } from '../../redux-api/feature-toggling';
import { Behandling } from '../behandling/behandling';
import { Dokumenter } from '../dokumenter/dokumenter';
import { PanelToggles } from '../klagebehandling/types';
import { Kvalitetsvurdering } from '../kvalitetsvurdering/kvalitetsvurdering';
import { PanelContainer } from './panel';

interface KlagebehandlingPanelsProps {
  toggles: PanelToggles;
}

export const KlagebehandlingPanels = ({ toggles }: KlagebehandlingPanelsProps): JSX.Element => {
  const { data: featureTogglingEditor } = useGetFeatureTogglingEditorQuery();

  return (
    <PageContainer data-testid="klagebehandling-panels">
      <Dokumenter shown={toggles.documents} />
      <Brevutforming featureTogglingEditor={featureTogglingEditor} toggled={toggles.brevutforming} />
      <Behandling shown={toggles.behandling} />
      <Kvalitetsvurdering shown={toggles.kvalitetsvurdering} />
    </PageContainer>
  );
};

interface BrevutformingProps {
  featureTogglingEditor: boolean | undefined;
  toggled: boolean;
}

const Brevutforming = ({ featureTogglingEditor, toggled }: BrevutformingProps) => {
  if (featureTogglingEditor === true && toggled) {
    return (
      <PanelContainer>
        <h2>Editor</h2>
      </PanelContainer>
    );
  }

  return null;
};

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
