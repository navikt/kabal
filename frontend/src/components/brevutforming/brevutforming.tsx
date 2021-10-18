import React from 'react';
import { useGetFeatureTogglingEditorQuery } from '../../redux-api/feature-toggling';
import { PanelContainer } from '../klagebehandling-panels/panel';

export interface BrevutformingProps {
  shown: boolean;
}

export const Brevutforming = ({ shown }: BrevutformingProps) => {
  const { data: featureTogglingEditor } = useGetFeatureTogglingEditorQuery();

  if (!shown || featureTogglingEditor === false) {
    return null;
  }

  return (
    <PanelContainer data-testid="brevutforming-panel">
      <h2>Brevutforming</h2>
    </PanelContainer>
  );
};
