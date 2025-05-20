import { AttachmentsOverview } from '@app/components/documents/new-documents/attachments-overview';
import { NewAttachmentButtons } from '@app/components/documents/new-documents/new-attachment-buttons';
import { NewAttachment } from '@app/components/documents/new-documents/new-document/new-attachment';
import { ROW_HEIGHT, SEPARATOR_HEIGHT } from '@app/components/documents/new-documents/new-documents-list/constants';
import {
  NewDocAttachmentsContainer,
  StyledAttachmentList,
  StyledAttachmentListItem,
} from '@app/components/documents/styled-components/attachment-list';
import { getIsIncomingDocument } from '@app/functions/is-incoming-document';
import { sortWithNumbers } from '@app/functions/sort-with-numbers/sort-with-numbers';
import type {
  IAttachmentDocument,
  IFileDocument,
  IParentDocument,
  ISmartDocument,
  JournalfoertDokument,
} from '@app/types/documents/documents';
import { useMemo } from 'react';

export interface ListProps {
  pdfOrSmartDocuments: (IFileDocument<string> | ISmartDocument<string>)[];
  journalfoerteDocuments: JournalfoertDokument[];
  pdfLength: number;
  journalfoertLength: number;
  pdfStart: number;
  journalfoertStart: number;
  hasAttachments: boolean;
  hasSeparator: boolean;
}

interface Props extends ListProps {
  parentDocument: IParentDocument;
}

export const AttachmentList = ({
  parentDocument,
  pdfOrSmartDocuments,
  journalfoerteDocuments,
  pdfLength,
  journalfoertLength,
  pdfStart,
  journalfoertStart,
  hasAttachments,
  hasSeparator,
}: Props) => {
  const isIncomingDocument = getIsIncomingDocument(parentDocument.dokumentTypeId);
  const hasOverview = hasAttachments && !isIncomingDocument;
  const overviewCount = hasOverview ? 1 : 0;
  const totalRowCount = pdfLength + journalfoertLength + overviewCount;

  const overviewHeight = overviewCount * ROW_HEIGHT;
  const pdfHeight = pdfLength * ROW_HEIGHT;
  const separatorHeight = hasSeparator ? SEPARATOR_HEIGHT : 0;

  const attachmentListHeight = totalRowCount * ROW_HEIGHT + separatorHeight;

  const sorted = useMemo(() => {
    if (isIncomingDocument) {
      return pdfOrSmartDocuments.sort((a, b) => sortWithNumbers(a.tittel, b.tittel));
    }

    return pdfOrSmartDocuments;
  }, [isIncomingDocument, pdfOrSmartDocuments]);

  return (
    <NewDocAttachmentsContainer $showTreeLine={hasAttachments}>
      <NewAttachmentButtons document={parentDocument} />
      <StyledAttachmentList
        data-testid="new-attachments-list"
        style={{ height: attachmentListHeight }}
        aria-rowcount={totalRowCount}
      >
        {hasOverview ? <AttachmentsOverview documentId={parentDocument.id} parentId={parentDocument.parentId} /> : null}
        {sorted.map((attachment, index) => (
          <Attachment
            key={attachment.id}
            attachment={attachment}
            parentDocument={parentDocument}
            top={(index + pdfStart) * ROW_HEIGHT + overviewHeight}
          />
        ))}

        {hasSeparator ? <ListSeparator top={pdfHeight + overviewHeight} /> : null}

        {journalfoerteDocuments.map((attachment, index) => (
          <Attachment
            key={attachment.id}
            attachment={attachment}
            parentDocument={parentDocument}
            top={(index + journalfoertStart) * ROW_HEIGHT + pdfHeight + separatorHeight + overviewHeight}
          />
        ))}
      </StyledAttachmentList>
    </NewDocAttachmentsContainer>
  );
};

interface AttachmentProps {
  attachment: IAttachmentDocument;
  parentDocument: IParentDocument;
  top: number;
}

const Attachment = ({ attachment, parentDocument, top }: AttachmentProps) => (
  <StyledAttachmentListItem
    key={attachment.id}
    data-testid="new-attachments-list-item"
    data-documentname={attachment.tittel}
    data-documentid={attachment.id}
    data-documenttype="attachment"
    style={{ top }}
  >
    <NewAttachment document={attachment} parentDocument={parentDocument} />
  </StyledAttachmentListItem>
);

const ListSeparator = ({ top }: { top: number }) => (
  <div
    data-label="Journalførte dokumenter"
    className="after:-translate-y-1/2 absolute right-0 left-0 my-3 ml-0 border-border-subtle border-b after:absolute after:top-1/2 after:left-5 after:bg-bg-default after:px-1 after:text-small after:content-[attr(data-label)]"
    style={{ top }}
  />
);
