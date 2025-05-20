import { SharedDocumentTitle } from '@app/components/documents/new-documents/shared/title';
import { StyledAttachmentListItem } from '@app/components/documents/styled-components/attachment-list';
import { getAttachmentsOverviewTabUrl } from '@app/domain/tabbed-document-url';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCreateVedleggFromJournalfoertDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { DOCUMENT_TYPE_NAMES, DocumentTypeEnum } from '@app/types/documents/documents';
import { BulletListIcon } from '@navikt/aksel-icons';
import { skipToken } from '@reduxjs/toolkit/query';
import { StyledNewAttachment } from './new-document/new-attachment';

interface Props {
  documentId: string;
  parentId: string | null;
  style?: React.CSSProperties;
}

export const AttachmentsOverview = ({ documentId, style, parentId }: Props) => {
  const oppgaveId = useOppgaveId();
  const [, { isLoading }] = useCreateVedleggFromJournalfoertDocumentMutation({
    fixedCacheKey: `createVedlegg-${documentId}`,
  });
  const title = DOCUMENT_TYPE_NAMES[DocumentTypeEnum.VEDLEGGSOVERSIKT];

  if (oppgaveId === skipToken) {
    return null;
  }

  return (
    <StyledAttachmentListItem
      data-testid="new-attachments-list-item"
      data-documentname={title}
      data-documenttype="attachment"
      style={style}
    >
      <StyledNewAttachment
        data-documentname={title}
        data-testid="new-document-list-item-content"
        data-documenttype="attachment"
        onDragStart={(e) => e.preventDefault()}
        draggable={false}
      >
        <SharedDocumentTitle
          title={title}
          parentId={parentId}
          url={getAttachmentsOverviewTabUrl(oppgaveId, documentId)}
          documentId={documentId}
          icon={<BulletListIcon aria-hidden />}
          type={DocumentTypeEnum.VEDLEGGSOVERSIKT}
          disabled={isLoading}
        />
      </StyledNewAttachment>
    </StyledAttachmentListItem>
  );
};
