import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { useGetArkiverteDokumenterQuery } from '../../../../redux-api/oppgaver/queries/documents';
import { StyledDocumentListItem } from '../styled-components/document-list';
import { Document } from './document';

interface Props {
  oppgaveId: string | typeof skipToken;
  pageReferences: (string | null)[];
  pageReference: string | null;
  temaer: string[];
}

export const DocumentsPage = ({ oppgaveId, pageReference, pageReferences, temaer }: Props) => {
  const { data } = useGetArkiverteDokumenterQuery(
    oppgaveId === skipToken
      ? skipToken
      : {
          oppgaveId,
          pageReference,
          temaer,
        }
  );

  if (typeof data === 'undefined') {
    return null;
  }

  return (
    <>
      {data.dokumenter.map((document) => (
        <StyledDocumentListItem
          key={`dokument_${document.journalpostId}_${document.dokumentInfoId}`}
          data-testid="oppgavebehandling-documents-all-list-item"
          data-documentname={document.tittel}
        >
          <Document document={document} pageReferences={pageReferences} temaer={temaer} />
        </StyledDocumentListItem>
      ))}
    </>
  );
};
