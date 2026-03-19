import { BulletListIcon } from '@navikt/aksel-icons';
import { skipToken } from '@reduxjs/toolkit/query';
import { StyledNewAttachment } from '@/components/documents/new-documents/new-document/new-attachment';
import { SharedDocumentTitle } from '@/components/documents/new-documents/shared/title';
import { StyledAttachmentListItem } from '@/components/documents/styled-components/attachment-list';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentTabUrl } from '@/hooks/use-document-tab-url';
import { useCreateVedleggFromJournalfoertDocumentMutation } from '@/redux-api/oppgaver/mutations/documents';
import { DOCUMENT_TYPE_NAMES, DocumentTypeEnum } from '@/types/documents/documents';

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

  const { getAttachmentsOverviewUrl } = useDocumentTabUrl();

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
          url={getAttachmentsOverviewUrl(oppgaveId, documentId)}
          documentId={documentId}
          icon={<BulletListIcon aria-hidden />}
          type={DocumentTypeEnum.VEDLEGGSOVERSIKT}
          disabled={isLoading}
        />
      </StyledNewAttachment>
    </StyledAttachmentListItem>
  );
};
