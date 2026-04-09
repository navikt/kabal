import type { HTMLProps } from 'react';
import { Attachment } from '@/components/documents/journalfoerte-documents/document/attachments/attachment';
import { StyledAttachmentListItem } from '@/components/documents/styled-components/attachment-list';
import type { IArkivertDocument, Journalstatus } from '@/types/arkiverte-documents';

interface AttachmentListItemProps extends HTMLProps<HTMLLIElement> {
  journalpostId: string;
  journalpoststatus: Journalstatus | null;
  vedlegg: IArkivertDocument['vedlegg'][0];
  showVedlegg: boolean;
  toggleShowVedlegg: () => void;
  hasVedlegg: boolean;
  documentIndex: number;
  index: number;
  children?: React.ReactNode;
}

export const AttachmentListItem = ({
  journalpostId,
  journalpoststatus,
  vedlegg,
  showVedlegg,
  toggleShowVedlegg,
  hasVedlegg,
  documentIndex,
  index,
  children,
  ...props
}: AttachmentListItemProps) => (
  <StyledAttachmentListItem data-documentname={vedlegg.tittel} {...props}>
    <Attachment
      vedlegg={vedlegg}
      journalpostId={journalpostId}
      journalpoststatus={journalpoststatus}
      showVedlegg={showVedlegg}
      toggleShowVedlegg={toggleShowVedlegg}
      hasVedlegg={hasVedlegg}
      documentIndex={documentIndex}
      index={index}
    />
    {children}
  </StyledAttachmentListItem>
);
