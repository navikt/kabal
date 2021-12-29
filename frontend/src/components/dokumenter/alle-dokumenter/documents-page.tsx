import React from 'react';
import { useOppgaveType } from '../../../hooks/use-oppgave-type';
import { useGetDokumenterQuery } from '../../../redux-api/oppgavebehandling';
import { ListItem } from '../styled-components/fullvisning';
import { Document } from './document';

interface DocumentsPageProps {
  oppgaveId: string;
  pageReference: string | null;
  pageSize: number;
  temaer: string[];
}

export const DocumentsPage = ({ oppgaveId, pageReference, pageSize, temaer }: DocumentsPageProps) => {
  const type = useOppgaveType();
  const { data } = useGetDokumenterQuery({
    oppgaveId,
    type,
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
        <ListItem
          key={`dokument_${document.journalpostId}_${document.dokumentInfoId}`}
          data-testid="klagebehandling-documents-all-list-item"
        >
          <Document document={document} />
        </ListItem>
      ))}
    </>
  );
};
