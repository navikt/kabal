import React from 'react';
import { useGetDokumenterQuery } from '../../../redux-api/oppgave';
import { ListItem } from '../styled-components/fullvisning';
import { Document } from './document';

interface DocumentsPageProps {
  klagebehandlingId: string;
  pageReference: string | null;
  pageSize: number;
  temaer: string[];
}

export const DocumentsPage = ({ klagebehandlingId, pageReference, pageSize, temaer }: DocumentsPageProps) => {
  const { data } = useGetDokumenterQuery({
    klagebehandlingId,
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
        <ListItem key={`dokument_${document.journalpostId}_${document.dokumentInfoId}`}>
          <Document document={document} />
        </ListItem>
      ))}
    </>
  );
};
