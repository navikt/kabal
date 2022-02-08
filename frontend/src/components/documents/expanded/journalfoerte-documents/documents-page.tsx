import React from 'react';
import { useGetArkiverteDokumenterQuery } from '../../../../redux-api/oppgavebehandling';
import { StyledDocumentListItem } from '../styled-components/document-list';
import { Document } from './document';

interface Props {
  oppgaveId: string;
  pageReference: string | null;
  pageSize: number;
  temaer: string[];
}

export const DocumentsPage = ({ oppgaveId, pageReference, pageSize, temaer }: Props) => {
  const { data } = useGetArkiverteDokumenterQuery({
    oppgaveId,
    pageReference,
    pageSize,
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
        >
          <Document document={document} />
        </StyledDocumentListItem>
      ))}
    </>
  );
};
