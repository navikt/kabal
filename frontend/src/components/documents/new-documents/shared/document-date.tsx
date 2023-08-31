import React, { HTMLAttributes, useMemo } from 'react';
import { isoDateTimeToPrettyDate } from '@app/domain/date';
import { DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';

interface Props extends Omit<HTMLAttributes<HTMLTimeElement>, 'dateTime'> {
  document: IMainDocument;
}

export const DocumentDate = ({ document, ...attrs }: Props) => {
  const dateString = useMemo(() => {
    if (document.type === DocumentTypeEnum.JOURNALFOERT) {
      return document.journalfoertDokumentReference.datoOpprettet;
    }

    return document.created;
  }, [document]);

  return (
    <time dateTime={dateString} {...attrs}>
      {isoDateTimeToPrettyDate(dateString)}
    </time>
  );
};
