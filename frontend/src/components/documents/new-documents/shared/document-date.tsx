import React, { HTMLAttributes } from 'react';
import { isoDateTimeToPrettyDate } from '@app/domain/date';
import { IJournalfoertDokumentReference } from '@app/types/documents/documents';

interface Props extends Omit<HTMLAttributes<HTMLTimeElement>, 'dateTime'> {
  document: IJournalfoertDokumentReference;
}

export const DocumentDate = ({ document, ...attrs }: Props) => (
  <time {...attrs} dateTime={document.journalfoertDokumentReference.datoOpprettet}>
    {isoDateTimeToPrettyDate(document.journalfoertDokumentReference.datoOpprettet)}
  </time>
);
