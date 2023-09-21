import React, { HTMLAttributes, memo } from 'react';
import { isoDateTimeToPrettyDate } from '@app/domain/date';
import { DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';

interface Props extends Omit<HTMLAttributes<HTMLTimeElement>, 'dateTime'> {
  document: IMainDocument;
}

export const DocumentDate = memo(
  ({ document, ...attrs }: Props) => {
    if (document.type === DocumentTypeEnum.JOURNALFOERT) {
      return (
        <time {...attrs} dateTime={document.journalfoertDokumentReference.datoOpprettet}>
          {isoDateTimeToPrettyDate(document.journalfoertDokumentReference.datoOpprettet)}
        </time>
      );
    }

    return null;
  },
  (prevProps, nextProps) => {
    if (
      prevProps.document.type === DocumentTypeEnum.JOURNALFOERT &&
      nextProps.document.type === DocumentTypeEnum.JOURNALFOERT
    ) {
      return (
        prevProps.document.journalfoertDokumentReference.datoOpprettet ===
        nextProps.document.journalfoertDokumentReference.datoOpprettet
      );
    }

    return prevProps.document.type === nextProps.document.type;
  },
);

DocumentDate.displayName = 'DocumentDate';
