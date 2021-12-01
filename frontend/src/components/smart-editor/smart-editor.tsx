import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getFullName } from '../../domain/name';
import { isNotNull } from '../../functions/is-not-type-guards';
import { useKlagebehandling } from '../../hooks/use-klagebehandling';
import { useGetSmartEditorQuery, useUpdateSmartEditorMutation } from '../../redux-api/smart-editor';
import { useGetSmartEditorIdQuery } from '../../redux-api/smart-editor-id';
import { ISmartEditor, ISmartEditorElement } from '../../redux-api/smart-editor-types';
import { AutofillInput } from './elements/autofill-input';
import { DateElement } from './elements/date';
import { RichTextEditorElement } from './elements/rich-text/rich-text-editor';
import { SignatureElement } from './elements/signature';
import { StaticText } from './elements/static-text';
import { StyledInput } from './elements/text-input';
import { ErrorMessage } from './error-boundary';
import { NewDocument } from './new-document/new-document';

export const SmartEditor = (): JSX.Element | null => {
  const [klagebehandling] = useKlagebehandling();
  const { data: smartEditorIdData } = useGetSmartEditorIdQuery(klagebehandling?.id ?? skipToken);
  const {
    data: smartEditor,
    isFetching,
    isError,
    error,
  } = useGetSmartEditorQuery(smartEditorIdData?.smartEditorId ?? skipToken);
  const [saveSmartEditor] = useUpdateSmartEditorMutation();
  const [value, setValue] = useState<ISmartEditor | null>(smartEditor?.smartEditorData ?? null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (typeof smartEditorIdData?.smartEditorId !== 'string' || value === null) {
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

  useEffect(() => {
    if (smartEditorIdData?.smartEditorId === null) {
      setValue(null);
    }
  }, [smartEditorIdData, setValue]);

  const onChange = useCallback(
    (e: ISmartEditorElement) => {
      if (typeof smartEditor === 'undefined' || smartEditor === null) {
        return;
      }

      const newContent: ISmartEditorElement[] =
        (value ?? smartEditor.smartEditorData)?.content.map((element) => {
          if (e.id === element.id) {
            if (element.type === 'rich-text' && e.type === 'rich-text') {
              return {
                ...e,
                content: e.content,
              };
            }

            if (element.type === 'static-text' && e.type === 'static-text') {
              return {
                ...e,
                content: e.content,
              };
            }

            if (element.type === 'text' && e.type === 'text') {
              return {
                ...e,
                content: e.content,
              };
            }

            if (element.type === 'signature' && e.type === 'signature') {
              return {
                ...e,
                content: e.content,
              };
            }
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
    },
    [smartEditor, value, setValue]
  );

  if (smartEditorIdData?.smartEditorId === null || smartEditor === null) {
    return <NewDocument />;
  }

  if (typeof smartEditor === 'undefined' || isFetching || typeof klagebehandling === 'undefined') {
    return <NavFrontendSpinner />;
  }

  if (isError) {
    return <ErrorMessage klagebehandlingId={klagebehandling.id} error={error} />;
  }

  const elements = (value ?? smartEditor.smartEditorData).content
    .map((e) => {
      switch (e.type) {
        case 'rich-text': {
          return (
            <RichTextEditorElement
              key={e.id}
              elementId={e.id}
              onChange={(content) => onChange({ ...e, content })}
              content={e.content}
            />
          );
        }

        case 'text':
          if (e.id === 'klager') {
            return (
              <AutofillInput
                key={e.id}
                title={e.label}
                placeholder={e.label}
                defaultValue={getFullName(klagebehandling.klager.person?.navn)}
                value={e.content}
                onChange={(content) => onChange({ ...e, content })}
              />
            );
          }

          return (
            <StyledInput
              key={e.id}
              type="text"
              placeholder={e.label}
              onChange={({ target }) => onChange({ ...e, content: target.value })}
            />
          );

        case 'date':
          return (
            <RightInfoBox key={e.id}>
              <DateElement {...e} />
            </RightInfoBox>
          );

        case 'static-text':
          return <StaticText key={e.id} content={e.content} />;

        case 'signature': {
          return (
            <SignatureElement key={e.id} content={e.content} onChange={(content) => onChange({ ...e, content })} />
          );
        }

        default:
          return null;
      }
    })
    .filter(isNotNull);

  return <ElementsSection>{elements}</ElementsSection>;
};

const ElementsSection = styled.section`
  height: fit-content;
  overflow-y: visible;
  padding-bottom: 3em;
`;

const RightInfoBox = styled.div`
  text-align: right;
  margin: 2em;
`;
