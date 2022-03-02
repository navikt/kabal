import React from 'react';
import { IArkivertDocument } from '../../../../types/arkiverte-documents';
import { StyledAttachmentList, StyledAttachmentListItem } from '../styled-components/attachment-list';
import { Attachment } from './attachment';

interface Props {
  oppgavebehandlingId: string;
  document: IArkivertDocument;
  pageReferences: (string | null)[];
  temaer: string[];
}

export const AttachmentList = ({ oppgavebehandlingId, document, pageReferences, temaer }: Props) => {
  if (document.vedlegg.length === 0) {
    return null;
  }

  return (
    <StyledAttachmentList data-testid="oppgavebehandling-documents-all-vedlegg-list">
      {document.vedlegg.map((vedlegg) => (
        <StyledAttachmentListItem
          key={`vedlegg_${document.journalpostId}_${vedlegg.dokumentInfoId}`}
          data-testid="oppgavebehandling-documents-all-list-item"
          data-documentname={vedlegg.tittel}
        >
          <Attachment
            oppgavebehandlingId={oppgavebehandlingId}
            vedlegg={vedlegg}
            document={document}
            pageReferences={pageReferences}
            temaer={temaer}
          />
        </StyledAttachmentListItem>
      ))}
    </StyledAttachmentList>
  );
};
