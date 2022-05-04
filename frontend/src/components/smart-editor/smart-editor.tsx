import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetSmartEditorQuery } from '../../redux-api/smart-editor-api';
import { SmartEditorContext } from './context/smart-editor-context';
import { RichTextEditorElement } from './rich-text-editor/rich-text-editor';

export const SmartEditor = (): JSX.Element | null => {
  const oppgaveId = useOppgaveId();
  const { documentId } = useContext(SmartEditorContext);
  const { data: smartEditor, isFetching } = useGetSmartEditorQuery(
    documentId === null ? skipToken : { oppgaveId, dokumentId: documentId }
  );

  if (isFetching || typeof smartEditor === 'undefined' || smartEditor === null || documentId === null) {
    return <Loader size="xlarge" />;
  }

  return (
    <ElementsSection>
      <RichTextEditorElement documentId={documentId} oppgaveId={oppgaveId} savedContent={smartEditor.content} />
    </ElementsSection>
  );
};

const ElementsSection = styled.article`
  flex-grow: 1;
  width: 210mm;
  height: 100%;
  overflow-y: auto;
  scroll-padding-top: 32px;
  scroll-padding-bottom: 32px;

  > :first-child {
    margin-top: 0;
  }
`;
