import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useContext, useEffect, useState } from 'react';
import { Descendant } from 'slate';
import styled from 'styled-components';
import { isNotNull } from '../../functions/is-not-type-guards';
import { useOppgaveId } from '../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetSmartEditorQuery, useUpdateSmartEditorMutation } from '../../redux-api/smart-editor-api';
import { ISmartEditorElement } from '../../types/smart-editor';
import { SmartEditorContext } from './context/smart-editor-context';
import { RichTextEditorElement } from './elements/rich-text/rich-text-editor';

export const SmartEditor = (): JSX.Element | null => {
  const oppgaveId = useOppgaveId();
  const { documentId } = useContext(SmartEditorContext);
  const { data: smartEditor, isFetching } = useGetSmartEditorQuery(
    documentId === null ? skipToken : { oppgaveId, dokumentId: documentId }
  );
  const [saveSmartEditor] = useUpdateSmartEditorMutation();
  const [value, setValue] = useState<ISmartEditorElement[] | undefined>(smartEditor?.content);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (documentId === null || typeof value === 'undefined') {
        return;
      }

      saveSmartEditor({ dokumentId: documentId, oppgaveId, content: value });
    }, 1000);
    return () => clearTimeout(timeout); // Clear existing timer every time it runs.
  }, [documentId, oppgaveId, saveSmartEditor, value]);

  if (isFetching || typeof smartEditor === 'undefined' || smartEditor === null) {
    return <NavFrontendSpinner />;
  }

  const elements = smartEditor.content
    .map((e) => {
      switch (e.type) {
        case 'rich-text': {
          const onChange = (content: Descendant[]) => {
            const newContent: ISmartEditorElement[] =
              (value ?? smartEditor.content)?.map((element) => {
                if (e.id === element.id) {
                  return {
                    ...e,
                    content,
                  };
                }

                return element;
              }) ?? [];

            setValue(newContent);
          };

          return <RichTextEditorElement key={e.id} elementId={e.id} onChange={onChange} content={e.content} />;
        }

        case 'text':
          return (
            <ElementLabel key={e.id}>
              {e.label}
              <input type="text" defaultValue={e.content} />
            </ElementLabel>
          );
        default:
          return null;
      }
    })
    .filter(isNotNull);

  return <ElementsSection>{elements}</ElementsSection>;
};

const ElementsSection = styled.section`
  height: 100%;
  overflow-y: auto;
  width: 70%;
`;

const ElementLabel = styled.label`
  display: block;
  margin-bottom: 10em;

  &::last-child {
    margin-bottom: 0;
  }
`;
