import React from 'react';
import { IArkivertDocumentVedlegg } from '../../../../types/arkiverte-documents';
import { StyledAttachmentList } from '../styled-components/attachment-list';
import { Attachment } from './attachment';

interface Props {
  vedleggListe: IArkivertDocumentVedlegg[];
  journalpostId: string;
}

export const AttachmentList = ({ vedleggListe, journalpostId }: Props) => (
  <StyledAttachmentList data-testid="oppgavebehandling-documents-tilknyttede-vedlegg-list">
    {vedleggListe.map((vedlegg) => (
      <Attachment key={journalpostId + vedlegg.dokumentInfoId} journalpostId={journalpostId} vedlegg={vedlegg} />
    ))}
  </StyledAttachmentList>
);
