import type { HTMLAttributes } from 'react';
import { isoDateTimeToPrettyDate } from '@/domain/date';
import type { JournalfoertDokument } from '@/types/documents/documents';

interface Props extends Omit<HTMLAttributes<HTMLTimeElement>, 'dateTime'> {
  document: JournalfoertDokument;
}

export const DocumentDate = ({ document, ...attrs }: Props) => (
  <time {...attrs} dateTime={document.journalfoertDokumentReference.datoSortering}>
    {isoDateTimeToPrettyDate(document.journalfoertDokumentReference.datoSortering)}
  </time>
);
