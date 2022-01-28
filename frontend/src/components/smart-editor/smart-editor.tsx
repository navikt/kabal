import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useEffect, useState } from 'react';
import { Descendant } from 'slate';
import styled from 'styled-components';
import { isNotNull } from '../../functions/is-not-type-guards';
import { useOppgaveId } from '../../hooks/use-oppgave-id';
import { useGetSmartEditorQuery, useUpdateSmartEditorMutation } from '../../redux-api/smart-editor';
import { useGetSmartEditorIdQuery } from '../../redux-api/smart-editor-id';
import { ISmartEditor, ISmartEditorElement } from '../../types/smart-editor';
import { RichTextEditorElement } from './elements/rich-text/rich-text-editor';
import { NewDocument } from './new-document/new-document';

export const SmartEditor = (): JSX.Element | null => {
  const oppgaveId = useOppgaveId();
  const { data: smartEditorIdData } = useGetSmartEditorIdQuery(oppgaveId);
  const { data: smartEditor, isFetching } = useGetSmartEditorQuery(smartEditorIdData?.smartEditorId ?? skipToken);
  const [saveSmartEditor] = useUpdateSmartEditorMutation();
  const [value, setValue] = useState<ISmartEditor | undefined>(smartEditor?.smartEditorData);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (typeof smartEditorIdData?.smartEditorId !== 'string' || typeof value === 'undefined') {
        return;
      }

      // id is undefined after HMR
      if (typeof value.id === 'undefined') {
        return;
      }

      saveSmartEditor(value);
    }, 1000);
    return () => clearTimeout(timeout); // Clear existing timer every time it runs.
  }, [value, smartEditorIdData?.smartEditorId, saveSmartEditor]);

  if (smartEditorIdData?.smartEditorId === null || smartEditor === null) {
    return <NewDocument />;
  }

  if (typeof smartEditor === 'undefined' || isFetching) {
    return <NavFrontendSpinner />;
  }

  const elements = smartEditor.smartEditorData.content
    .map((e) => {
      switch (e.type) {
        case 'rich-text': {
          const onChange = (content: Descendant[]) => {
            const newContent: ISmartEditorElement[] =
              (value ?? smartEditor.smartEditorData)?.content.map((element) => {
                if (e.id === element.id) {
                  return {
                    ...e,
                    content,
                  };
                }

                return element;
              }) ?? [];

            const updatedValue: ISmartEditor = {
              ...smartEditor.smartEditorData,
              ...value,
              id: smartEditor.id,
              content: newContent,
            };

            setValue(updatedValue);
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
`;

const ElementLabel = styled.label`
  display: block;
  margin-bottom: 10em;

  &::last-child {
    margin-bottom: 0;
  }
`;
