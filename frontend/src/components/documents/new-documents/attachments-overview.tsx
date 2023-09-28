import { BulletListIcon } from '@navikt/aksel-icons';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { StyledNewDocument } from '@app/components/documents/new-documents/new-document/new-document';
import { SharedDocumentTitle } from '@app/components/documents/new-documents/shared/title';
import { StyledAttachmentListItem } from '@app/components/documents/styled-components/attachment-list';
import { getAttachmentsOverviewTabUrl } from '@app/domain/tabbed-document-url';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { DOCUMENT_TYPE_NAMES, DocumentTypeEnum } from '@app/types/documents/documents';

interface Props {
  documentId: string;
}

export const AttachmentsOverview = ({ documentId }: Props) => {
  const oppgaveId = useOppgaveId();
  const title = DOCUMENT_TYPE_NAMES[DocumentTypeEnum.VEDLEGGSOVERSIKT];

  if (oppgaveId === skipToken) {
    return null;
  }

  const url = getAttachmentsOverviewTabUrl(oppgaveId, documentId);
  // const tabId = getAttachmentsOverviewTabId(documentId);

  return (
    <StyledAttachmentListItem
      data-testid="new-attachments-list-item"
      data-documentname={title}
      data-documenttype="attachment"
    >
      <StyledNewDocument
        $isExpanded={false}
        data-documentname={title}
        data-testid="new-document-list-item-content"
        data-documenttype="attachment"
        onDragStart={(e) => e.preventDefault()}
        draggable={false}
      >
        <SharedDocumentTitle
          title={title}
          url={url}
          documentId={documentId}
          icon={<BulletListIcon aria-hidden />}
          type={DocumentTypeEnum.VEDLEGGSOVERSIKT}
        />
      </StyledNewDocument>
    </StyledAttachmentListItem>
  );
};
