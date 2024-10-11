import { isoDateTimeToPrettyDate } from '@app/domain/date';
import type { JournalfoertDokument } from '@app/types/documents/documents';
import type { HTMLAttributes } from 'react';

interface Props extends Omit<HTMLAttributes<HTMLTimeElement>, 'dateTime'> {
  document: JournalfoertDokument;
}

export const DocumentDate = ({ document, ...attrs }: Props) => (
  <time {...attrs} dateTime={document.journalfoertDokumentReference.datoOpprettet}>
    {isoDateTimeToPrettyDate(document.journalfoertDokumentReference.datoOpprettet)}
  </time>
);
