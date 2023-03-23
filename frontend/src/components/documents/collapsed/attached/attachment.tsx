import React from 'react';
import { IArkivertDocumentVedlegg } from '@app/types/arkiverte-documents';
import { AttachmentListItem } from '../styled-components/attachment-list';
import { OpenDocumentButton } from './open-document-button';

interface Props {
  journalpostId: string;
  vedlegg: IArkivertDocumentVedlegg;
}

export const Attachment = ({ journalpostId, vedlegg }: Props) => (
  <AttachmentListItem data-testid="oppgavebehandling-documents-tilknyttede-vedlegg-list-item">
    <OpenDocumentButton
      title={vedlegg.tittel ?? 'Tittel mangler'}
      dokumentInfoId={vedlegg.dokumentInfoId}
      journalpostId={journalpostId}
      valgt={vedlegg.valgt}
      harTilgangTilArkivvariant={vedlegg.harTilgangTilArkivvariant}
      data-testid="oppgavebehandling-documents-open-document-button"
    />
  </AttachmentListItem>
);
