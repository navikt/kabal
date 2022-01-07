import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useState } from 'react';
import { useCanEdit } from '../../hooks/use-can-edit';
import { useOppgaveId } from '../../hooks/use-oppgave-id';
import { useOppgaveType } from '../../hooks/use-oppgave-type';
import { useGetSmartEditorQuery } from '../../redux-api/smart-editor';
import { useGetSmartEditorIdQuery } from '../../redux-api/smart-editor-id';
import { ValidationErrorProvider } from '../kvalitetsvurdering/validation-error-context';
import { OppgavebehandlingControls } from '../oppgavebehandling-controls/oppgavebehandling-controls';
import { AnkeFooter } from '../oppgavebehandling-footer/anke-footer';
import { OppgavebehandlingPanels } from '../oppgavebehandling-panels/oppgavebehandling-panels';
import { PanelToggles } from './types';

export const Ankebehandling = () => {
  const oppgaveId = useOppgaveId();
  const type = useOppgaveType();
  const { data: smartEditorIdData } = useGetSmartEditorIdQuery({ oppgaveId, type });
  const { data: smartEditor } = useGetSmartEditorQuery(smartEditorIdData?.smartEditorId ?? skipToken);
  const canEdit = useCanEdit();

  const [toggles, setPanelToggles] = useState<PanelToggles>({
    documents: true,
    smartEditor: (typeof smartEditorIdData?.smartEditorId === 'string' && smartEditor !== null) || canEdit,
    behandling: true,
    kvalitetsvurdering: true,
  });

  const setPanel = (panel: keyof PanelToggles, checked: boolean) => setPanelToggles({ ...toggles, [panel]: checked });

  return (
    <ValidationErrorProvider>
      <OppgavebehandlingControls setPanel={setPanel} toggles={toggles} />
      <OppgavebehandlingPanels toggles={toggles} />
      <AnkeFooter />
    </ValidationErrorProvider>
  );
};
