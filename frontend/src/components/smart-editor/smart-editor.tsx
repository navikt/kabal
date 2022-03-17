import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { isNotNull } from '../../functions/is-not-type-guards';
import { useOppgaveId } from '../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetSmartEditorQuery, useUpdateSmartEditorMutation } from '../../redux-api/smart-editor-api';
import {
  IDocumentTitleElement,
  ISectionChildElement,
  ISectionElement,
  ISignatureElement,
  ISmartEditorElement,
} from '../../types/smart-editor';
import { SmartEditorContext } from './context/smart-editor-context';
import { DocumentTitleElement } from './elements/document-title/document-title';
import { SectionElement } from './elements/section/section';
import { Signature } from './elements/signature/signature';

export const SmartEditor = (): JSX.Element | null => {
  const oppgaveId = useOppgaveId();
  const { documentId } = useContext(SmartEditorContext);
  const { data: smartEditor, isFetching } = useGetSmartEditorQuery(
    documentId === null ? skipToken : { oppgaveId, dokumentId: documentId }
  );

  if (isFetching || typeof smartEditor === 'undefined' || smartEditor === null || documentId === null) {
    return <NavFrontendSpinner />;
  }

  return <RenderSmartEditor documentId={documentId} savedContent={smartEditor.content} oppgaveId={oppgaveId} />;
};

interface RenderSmartEditorProps {
  documentId: string;
  oppgaveId: string;
  savedContent: ISmartEditorElement[];
}

const RenderSmartEditor = React.memo(
  ({ savedContent, documentId, oppgaveId }: RenderSmartEditorProps) => {
    const [content, setContent] = useState(savedContent);
    const [saveSmartEditor] = useUpdateSmartEditorMutation();

    useEffect(() => {
      const timeout = setTimeout(() => {
        saveSmartEditor({ dokumentId: documentId, oppgaveId, content });
      }, 1000);

      return () => clearTimeout(timeout); // Clear existing timer every time it runs.
    }, [documentId, oppgaveId, saveSmartEditor, setContent, content]);

    const onChange = useCallback(
      <T extends ISmartEditorElement>(update: T['content'], e: T) =>
        setContent((c) =>
          c.map((element) => {
            if (e.id === element.id) {
              return {
                ...e,
                content: update,
              };
            }

            return element;
          })
        ),
      [setContent]
    );

    const elements = content
      .map((element) => {
        const key = `${documentId}-${element.type}-${element.id}`;

        if (isDocumentTitle(element)) {
          return <DocumentTitleElement key={key} element={element} />;
        }

        if (isSignature(element)) {
          return <Signature key={key} savedContent={element.content} onChange={(c) => onChange(c, element)} />;
        }

        if (isSection(element)) {
          return (
            <SectionElement
              documentId={documentId}
              key={key}
              savedContent={element.content}
              onChange={(c) => onChange(c, element)}
            />
          );
        }

        return null;
      })
      .filter(isNotNull);

    return <ElementsSection>{elements}</ElementsSection>;
  },
  (prevProps, nextProps) =>
    prevProps.documentId === nextProps.documentId &&
    prevProps.oppgaveId === nextProps.oppgaveId &&
    prevProps.savedContent === nextProps.savedContent
);

RenderSmartEditor.displayName = 'RenderSmartEditor';

const ElementsSection = styled.article`
  width: 210mm;
  height: fit-content;
  flex-grow: 1;
  padding: 24px;

  > :first-child {
    margin-top: 0;
  }
`;

const isSection = (element: ISmartEditorElement | ISectionChildElement): element is ISectionElement =>
  element.type === 'section';
const isDocumentTitle = (element: ISmartEditorElement | ISectionChildElement): element is IDocumentTitleElement =>
  element.type === 'document-title';
const isSignature = (element: ISmartEditorElement | ISectionChildElement): element is ISignatureElement =>
  element.type === 'signature';
