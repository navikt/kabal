import React from 'react';
import { useGetArkiverteDokumenterQuery } from '../../../../redux-api/oppgavebehandling';
import { StyledDocumentListItem } from '../styled-components/document-list';
import { Document } from './document';

interface Props {
  oppgaveId: string;
  pageReferences: (string | null)[];
  pageReference: string | null;
  temaer: string[];
}

export const DocumentsPage = ({ oppgaveId, pageReference, pageReferences, temaer }: Props) => {
  const { data } = useGetArkiverteDokumenterQuery({
    oppgaveId,
    pageReference,
    temaer,
  });

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
