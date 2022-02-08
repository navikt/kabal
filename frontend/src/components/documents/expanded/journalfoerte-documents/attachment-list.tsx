import React from 'react';
import { IArkivertDocument } from '../../../../types/arkiverte-documents';
import { dokumentMatcher } from '../../helpers';
import { StyledAttachmentList, StyledAttachmentListItem } from '../styled-components/attachment-list';
import { Attachment } from './attachment';

interface Props {
  oppgavebehandlingId: string;
  document: IArkivertDocument;
}

export const AttachmentList = React.memo(
  ({ oppgavebehandlingId, document }: Props) => {
    if (document.vedlegg.length === 0) {
      return null;
    }

    return (
      <StyledAttachmentList data-testid="oppgavebehandling-documents-all-vedlegg-list">
        {document.vedlegg.map((vedlegg) => (
          <StyledAttachmentListItem
            key={`vedlegg_${document.journalpostId}_${document.dokumentInfoId}`}
            data-testid="oppgavebehandling-documents-all-list-item"
          >
            <Attachment oppgavebehandlingId={oppgavebehandlingId} vedlegg={vedlegg} document={document} />
          </StyledAttachmentListItem>
        ))}
      </StyledAttachmentList>
    );
  },
  (previous, next) => dokumentMatcher(previous.document, next.document)
);

AttachmentList.displayName = 'AttachmentList';
