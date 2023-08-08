import React, { HTMLAttributes } from 'react';
import { isoDateToPretty } from '@app/domain/date';
import { IJournalpost } from '@app/types/arkiverte-documents';

interface Props extends Omit<HTMLAttributes<HTMLTimeElement>, 'dateTime'> {
  journalpost: IJournalpost;
}

export const DocumentDate = ({ journalpost, ...attrs }: Props) => (
  <time dateTime={journalpost.datoOpprettet} {...attrs}>
    {isoDateToPretty(journalpost.registrert)}
  </time>
);
