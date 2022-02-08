import React, { useMemo } from 'react';
import { IArkivertDocumentVedlegg } from '../../../../types/arkiverte-documents';
import { IDocumentReference } from '../../../../types/oppgave-common';
import { StyledAttachmentList } from '../styled-components/attachment-list';
import { Attachment } from './attachment';

interface Props {
  vedleggListe: IArkivertDocumentVedlegg[];
  tilknyttedeDokumenter: IDocumentReference[];
  journalpostId: string;
}

export const AttachmentList = ({ vedleggListe, tilknyttedeDokumenter, journalpostId }: Props) => {
  const tilknyttedeVedlegg = useMemo<IArkivertDocumentVedlegg[]>(
    () =>
      vedleggListe.filter((vedlegg) =>
        tilknyttedeDokumenter.some(({ dokumentInfoId }) => dokumentInfoId === vedlegg.dokumentInfoId)
      ),
    [tilknyttedeDokumenter, vedleggListe]
  );

  return (
    <StyledAttachmentList data-testid="oppgavebehandling-documents-tilknyttede-vedlegg-list">
      {tilknyttedeVedlegg.map((vedlegg) => (
        <Attachment key={journalpostId + vedlegg.dokumentInfoId} journalpostId={journalpostId} vedlegg={vedlegg} />
      ))}
    </StyledAttachmentList>
  );
};
