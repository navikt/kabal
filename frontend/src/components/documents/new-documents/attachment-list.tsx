import React from 'react';
import { styled } from 'styled-components';
import { AttachmentsOverview } from '@app/components/documents/new-documents/attachments-overview';
import { ROW_HEIGHT, SEPARATOR_HEIGHT } from '@app/components/documents/new-documents/constants';
import { NewAttachmentButtons } from '@app/components/documents/new-documents/new-attachment-buttons';
import { NewAttachment } from '@app/components/documents/new-documents/new-document/new-attachment';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import {
  IFileDocument,
  IJournalfoertDokumentReference,
  IMainDocument,
  ISmartDocument,
} from '@app/types/documents/documents';
import {
  NewDocAttachmentsContainer,
  StyledAttachmentList,
  StyledAttachmentListItem,
} from '../styled-components/attachment-list';

export interface ListProps {
  pdfOrSmartDocuments: (IFileDocument | ISmartDocument)[];
  journalfoertDocumentReferences: IJournalfoertDokumentReference[];
  containsRolAttachments: boolean;

  pdfLength: number;
  journalfoertLength: number;
  pdfStart: number;
  journalfoertStart: number;
  hasAttachments: boolean;
  hasSeparator: boolean;
}

interface Props extends ListProps {
  parentDocument: IMainDocument;
}

export const AttachmentList = ({
  parentDocument,
  pdfOrSmartDocuments,
  journalfoertDocumentReferences,
  containsRolAttachments,
  pdfLength,
  journalfoertLength,
  pdfStart,
  journalfoertStart,
  hasAttachments,
  hasSeparator,
}: Props) => {
  const [isExpanded] = useIsExpanded();

  const overviewCount = hasAttachments ? 1 : 0;
  const totalRowCount = pdfLength + journalfoertLength + overviewCount;

  const overviewHeight = overviewCount * ROW_HEIGHT;
  const pdfHeight = pdfLength * ROW_HEIGHT;
  const separatorHeight = hasSeparator ? SEPARATOR_HEIGHT : 0;

  const attachmentListHeight = totalRowCount * ROW_HEIGHT + separatorHeight;

  return (
    <NewDocAttachmentsContainer $showTreeLine={hasAttachments}>
      {isExpanded ? <NewAttachmentButtons document={parentDocument} /> : null}
      <StyledAttachmentList
        data-testid="new-attachments-list"
        style={{ height: attachmentListHeight }}
        aria-rowcount={totalRowCount}
      >
        {hasAttachments ? <AttachmentsOverview documentId={parentDocument.id} /> : null}
        {pdfOrSmartDocuments.map((attachment, index) => (
          <Attachment
            key={attachment.id}
            attachment={attachment}
            parentDocument={parentDocument}
            containsRolAttachments={containsRolAttachments}
            top={(index + pdfStart) * ROW_HEIGHT + overviewHeight}
          />
        ))}

        {hasSeparator ? <ListSeparator style={{ top: pdfHeight + overviewHeight }} /> : null}

        {journalfoertDocumentReferences.map((attachment, index) => (
          <Attachment
            key={attachment.id}
            attachment={attachment}
            parentDocument={parentDocument}
            containsRolAttachments={containsRolAttachments}
            top={(index + journalfoertStart) * ROW_HEIGHT + pdfHeight + separatorHeight + overviewHeight}
          />
        ))}
      </StyledAttachmentList>
    </NewDocAttachmentsContainer>
  );
};

interface AttachmentProps {
  attachment: IMainDocument;
  parentDocument: IMainDocument;
  containsRolAttachments: boolean;
  top: number;
}

const Attachment = ({ attachment, parentDocument, containsRolAttachments, top }: AttachmentProps) => (
  <StyledAttachmentListItem
    key={attachment.id}
    data-testid="new-attachments-list-item"
    data-documentname={attachment.tittel}
    data-documentid={attachment.id}
    data-documenttype="attachment"
    style={{ position: 'absolute', top, width: '100%' }}
  >
    <NewAttachment
      document={attachment}
      parentDocument={parentDocument}
      containsRolAttachments={containsRolAttachments}
    />
  </StyledAttachmentListItem>
);

const ListSeparator = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  margin: 0;
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: 4px;
  border: none;
  border-bottom: 1px solid var(--a-border-subtle);

  &::after {
    content: 'Journalførte dokumenter';
    position: absolute;
    top: 50%;
    left: 17px;
    padding-left: 4px;
    padding-right: 4px;
    transform: translateY(-50%);
    background-color: white;
    font-size: 14px;
  }
`;
