import React from 'react';
import { isoDateToPretty } from '../../../../domain/date';
import { IArkivertDocument } from '../../../../types/arkiverte-documents';
import { DocumentDate } from '../styled-components/document';
import { DocumentListItem } from '../styled-components/document-list';
import { AttachmentList } from './attachment-list';
import { OpenDocumentButton } from './open-document-button';

interface Props {
  document: IArkivertDocument;
}

export const AttachedDocument = ({ document }: Props) => (
  <DocumentListItem data-testid="oppgavebehandling-documents-tilknyttede-list-item">
    <DocumentDate dateTime={document.registrert}>{isoDateToPretty(document.registrert)}</DocumentDate>
    <OpenDocumentButton
      title={document.tittel ?? 'Mangler tittel'}
      dokumentInfoId={document.dokumentInfoId}
      journalpostId={document.journalpostId}
      valgt={document.valgt}
      harTilgangTilArkivvariant={document.harTilgangTilArkivvariant}
      data-testid="oppgavebehandling-documents-open-document-button"
    />
    <AttachmentList journalpostId={document.journalpostId} vedleggListe={document.vedlegg} />
  </DocumentListItem>
);
