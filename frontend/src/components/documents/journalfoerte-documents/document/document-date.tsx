import React, { HTMLAttributes } from 'react';
import { isoDateTimeToPrettyDate } from '@app/domain/date';
import { IArkivertDocument } from '@app/types/arkiverte-documents';

interface Props extends Omit<HTMLAttributes<HTMLTimeElement>, 'dateTime'> {
  document: IArkivertDocument;
}

export const DocumentDate = ({ document, ...attrs }: Props) => (
  <time dateTime={document.datoOpprettet} {...attrs}>
    {isoDateTimeToPrettyDate(document.datoOpprettet)}
  </time>
);
