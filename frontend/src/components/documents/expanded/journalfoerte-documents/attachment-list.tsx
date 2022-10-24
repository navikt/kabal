import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { IArkivertDocument } from '../../../../types/arkiverte-documents';
import { StyledAttachmentList, StyledAttachmentListItem } from '../styled-components/attachment-list';
import { Attachment } from './attachment';

interface Props {
  oppgaveId: string | typeof skipToken;
  document: IArkivertDocument;
}

export const AttachmentList = ({ oppgaveId, document }: Props) => {
  if (document.vedlegg.length === 0 || typeof oppgaveId !== 'string') {
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
          <Attachment oppgavebehandlingId={oppgaveId} vedlegg={vedlegg} document={document} />
        </StyledAttachmentListItem>
      ))}
    </StyledAttachmentList>
  );
};
