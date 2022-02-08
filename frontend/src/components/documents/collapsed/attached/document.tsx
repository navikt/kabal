import React from 'react';
import { isoDateToPretty } from '../../../../domain/date';
import { IArkivertDocument } from '../../../../types/arkiverte-documents';
import { IDocumentReference } from '../../../../types/oppgave-common';
import { DocumentDate } from '../styled-components/document';
import { DocumentListItem } from '../styled-components/document-list';
import { AttachmentList } from './attachment-list';
import { OpenDocumentButton } from './open-document-button';

interface Props {
  dokument: IArkivertDocument;
  tilknyttet: boolean;
  tilknyttedeDokumenter: IDocumentReference[];
}

export const AttachedDocument = ({ dokument, tilknyttet, tilknyttedeDokumenter }: Props) => (
  <DocumentListItem data-testid="oppgavebehandling-documents-tilknyttede-list-item">
    <DocumentDate dateTime={dokument.registrert}>{isoDateToPretty(dokument.registrert)}</DocumentDate>
    <OpenDocumentButton
      title={dokument.tittel ?? 'Mangler tittel'}
      dokumentInfoId={dokument.dokumentInfoId}
      journalpostId={dokument.journalpostId}
      tilknyttet={tilknyttet}
      data-testid="oppgavebehandling-documents-open-document-button"
    />
    <AttachmentList
      journalpostId={dokument.journalpostId}
      vedleggListe={dokument.vedlegg}
      tilknyttedeDokumenter={tilknyttedeDokumenter}
    />
  </DocumentListItem>
);
