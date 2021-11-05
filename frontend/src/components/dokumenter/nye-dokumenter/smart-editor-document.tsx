import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useContext, useEffect } from 'react';
import { isoDateTimeToPrettyDate } from '../../../domain/date';
import { baseUrl } from '../../../redux-api/common';
import { useGetSmartEditorQuery } from '../../../redux-api/smart-editor';
import { useGetSmartEditorIdQuery } from '../../../redux-api/smart-editor-id';
import { ShownDocumentContext } from '../context';
import { DocumentButton } from '../styled-components/document-button';
import { DocumentTitle } from '../styled-components/fullvisning';
import { DeleteSmartEditorDocumentButton } from './delete-smart-editor-document-button';
import { StyledDate, StyledNewDocument } from './styled-components';

interface SmartEditorDocumentProps {
  klagebehandlingId: string;
  miniDisplay?: boolean;
}

export const SmartEditorDocument = ({ klagebehandlingId, miniDisplay = false }: SmartEditorDocumentProps) => {
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);
  const { data } = useGetSmartEditorIdQuery(klagebehandlingId);
  const { data: smartEditorData } = useGetSmartEditorQuery(data?.smartEditorId ?? skipToken);

  const name = 'Smart Editor dokument';
  const pdfBaseUrl = `${baseUrl}api/kabal-smart-editor-api/documents/${data?.smartEditorId}/pdf`;

  useEffect(() => {
    if (shownDocument === null) {
      return;
    }

    if (smartEditorData === null || typeof smartEditorData === 'undefined') {
      return;
    }

    if (!shownDocument.url.startsWith(pdfBaseUrl)) {
      return;
    }

    if (shownDocument.url.endsWith(smartEditorData.modified)) {
      return;
    }

    setShownDocument({
      title: name,
      url: `${pdfBaseUrl}?modified=${smartEditorData.modified}`,
    });
  }, [shownDocument, smartEditorData, setShownDocument, pdfBaseUrl]);

  if (typeof data?.smartEditorId !== 'string' || typeof smartEditorData?.modified !== 'string') {
    return null;
  }

  const onClick = () =>
    setShownDocument({
      title: name,
      url: `${pdfBaseUrl}?modified=${smartEditorData.modified}`,
    });

  const isActive = shownDocument?.url.startsWith(pdfBaseUrl) ?? false;

  if (miniDisplay) {
    return (
      <div data-testid="klagebehandling-documents-new-list-item">
        <DocumentButton
          isActive={isActive}
          onClick={onClick}
          data-testid="klagebehandling-documents-open-document-button"
        >
          {name}
        </DocumentButton>
      </div>
    );
  }

  return (
    <StyledNewDocument data-testid="klagebehandling-documents-new-list-item">
      <DocumentTitle>
        <DocumentButton
          isActive={isActive}
          onClick={onClick}
          data-testid="klagebehandling-documents-open-document-button"
        >
          {name}
        </DocumentButton>
      </DocumentTitle>
      <StyledDate>{isoDateTimeToPrettyDate(smartEditorData?.modified ?? null)}</StyledDate>
      <DeleteSmartEditorDocumentButton
        klagebehandlingId={klagebehandlingId}
        smartEditorId={data.smartEditorId}
        data-testid="klagebehandling-documents-smart-editor-document-delete-button"
      />
    </StyledNewDocument>
  );
};