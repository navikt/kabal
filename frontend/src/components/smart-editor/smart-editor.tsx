import '../rich-text/types/slate-global-types';
import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Descendant } from 'slate';
import styled from 'styled-components';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '../../hooks/oppgavebehandling/use-oppgave-id';
import { useUpdateSmartEditorMutation } from '../../redux-api/oppgaver/mutations/smart-editor';
import { useGetSmartEditorQuery } from '../../redux-api/oppgaver/queries/smart-editor';
import { useUser } from '../../simple-api-state/use-user';
import { IDocumentParams } from '../../types/documents/common-params';
import { MedunderskriverFlyt } from '../../types/kodeverk';
import { RichTextEditorElement } from '../rich-text/rich-text-editor/rich-text-editor';
import { SmartEditorContext } from './context/smart-editor-context';

export const SmartEditor = (): JSX.Element | null => {
  const oppgaveId = useOppgaveId();
  const { documentId, setSelection, focusedThreadId } = useContext(SmartEditorContext);

  const query: IDocumentParams | typeof skipToken =
    documentId === null || oppgaveId === skipToken ? skipToken : { oppgaveId, dokumentId: documentId };

  const { data: smartEditor, isFetching } = useGetSmartEditorQuery(query);
  const [updateDocument] = useUpdateSmartEditorMutation();
  const [content, setContent] = useState<Descendant[] | undefined>(smartEditor?.content);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (documentId === null || oppgaveId === skipToken || typeof content === 'undefined') {
        return;
      }

      updateDocument({
        oppgaveId,
        dokumentId: documentId,
        content,
        version: smartEditor?.version,
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [documentId, content, oppgaveId, updateDocument, smartEditor?.version]);

  const canEdit = useCanEditDocument();

  if (isFetching || typeof smartEditor === 'undefined' || smartEditor === null || documentId === null) {
    return <Loader size="xlarge" />;
  }

  return (
    <ElementsSection>
      <RichTextEditorElement
        onChange={setContent}
        onSelect={setSelection}
        savedContent={smartEditor.content}
        id={documentId}
        canEdit={canEdit}
        focusedThreadId={focusedThreadId}
        showCommentsButton
        showAnnotationsButton
        showGodeFormuleringerButton
      />
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

const useCanEditDocument = (): boolean => {
  const { data: oppgave, isLoading: oppgaveIsLoading, isFetching: oppgaveIsFetching } = useOppgave();
  const { data: user, isLoading: userIsLoading } = useUser();

  return useMemo<boolean>(() => {
    if (oppgaveIsLoading || userIsLoading || oppgaveIsFetching) {
      return false;
    }

    if (typeof oppgave === 'undefined' || typeof user === 'undefined' || oppgave.isAvsluttetAvSaksbehandler) {
      return false;
    }

    if (oppgave.medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
      return oppgave.medunderskriver?.navIdent === user.navIdent;
    }

    return oppgave.tildeltSaksbehandler?.navIdent === user.navIdent;
  }, [oppgave, oppgaveIsFetching, oppgaveIsLoading, user, userIsLoading]);
};
