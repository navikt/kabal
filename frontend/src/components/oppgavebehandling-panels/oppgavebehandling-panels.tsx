import React from 'react';
import { Behandling } from '../behandling/behandling';
import { Documents } from '../documents/documents';
import { Kvalitetsvurdering } from '../kvalitetsvurdering/kvalitetsvurdering';
import { SmartEditorPanel } from '../smart-editor/smart-editor-panel';
import { PageContainer } from './styled-components';

export const OppgavebehandlingPanels = (): JSX.Element => (
  <PageContainer>
    <Documents />
    <SmartEditorPanel />
    <Behandling />
    <Kvalitetsvurdering />
  </PageContainer>
);
