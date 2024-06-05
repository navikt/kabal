import { Tabs } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { SmartEditorContextComponent } from '@app/components/smart-editor/context';
import { useCanEditDocument } from '@app/components/smart-editor/hooks/use-can-edit-document';
import { Editor } from '@app/components/smart-editor/tabbed-editors/editor';
import { areDescendantsEqual } from '@app/functions/are-descendants-equal';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useUpdateSmartDocumentMutation } from '@app/redux-api/oppgaver/mutations/smart-document';
import { ISmartDocument } from '@app/types/documents/documents';

interface TabPanelProps {
  smartDocument: ISmartDocument;
}

export const TabPanel = ({ smartDocument }: TabPanelProps) => {
  const oppgaveId = useOppgaveId();
  const [update, status] = useUpdateSmartDocumentMutation();
  const [localContent, setLocalContent] = useState(smartDocument.content);
  const refContent = useRef(smartDocument.content);

  const { id, content } = smartDocument;

  const smartDocumentRef = useRef<ISmartDocument>(smartDocument);

  const canEditDocument = useCanEditDocument(smartDocument.templateId);
  const canEditDocumentRef = useRef(canEditDocument);

  // Normal debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!canEditDocument || areDescendantsEqual(localContent, content) || oppgaveId === skipToken) {
        return;
      }

      update({ content: localContent, oppgaveId, dokumentId: id, version: smartDocument.version });
    }, 2_000);

    return () => clearTimeout(timeout);
  }, [content, id, oppgaveId, smartDocument.version, update, localContent, canEditDocument]);

  // Ensure that smartDocumentRef and canEditDocumentRef are always up to date in order to avoid the unmount debounce triggering on archive/delete/fradeling
  useEffect(() => {
    const setRefs = () => {
      smartDocumentRef.current = smartDocument;
      canEditDocumentRef.current = canEditDocument;
    };

    setRefs();

    return setRefs;
  }, [canEditDocument, smartDocument]);

  // Unmount debounce
  useEffect(
    () => () => {
      if (
        oppgaveId === skipToken ||
        !canEditDocumentRef.current ||
        smartDocumentRef.current.isMarkertAvsluttet ||
        areDescendantsEqual(refContent.current, smartDocumentRef.current.content)
      ) {
        return;
      }

      update({ content: refContent.current, oppgaveId, dokumentId: id, version: smartDocumentRef.current.version });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <StyledTabsPanel value={smartDocument.id}>
      <SmartEditorContextComponent editor={smartDocument}>
        <Editor
          key={id}
          smartDocument={smartDocument}
          onChange={(c) => {
            refContent.current = c;
            setLocalContent(c);
          }}
          updateStatus={status}
        />
      </SmartEditorContextComponent>
    </StyledTabsPanel>
  );
};

export const StyledTabsPanel = styled(Tabs.Panel)`
  height: 100%;
  overflow: hidden;
`;
