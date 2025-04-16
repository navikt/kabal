import type { IArkivertDocument, Journalstatus } from '@app/types/arkiverte-documents';
import type { HTMLProps } from 'react';
import { StyledAttachmentListItem } from '../../../styled-components/attachment-list';
import { Attachment } from './attachment';

interface AttachmentListItemProps extends HTMLProps<HTMLLIElement> {
  journalpostId: string;
  journalpoststatus: Journalstatus | null;
  vedlegg: IArkivertDocument['vedlegg'][0];
  isSelected: boolean;
  showVedlegg: boolean;
  toggleShowVedlegg: () => void;
  hasVedlegg: boolean;
  children?: React.ReactNode;
}

export const AttachmentListItem = ({
  journalpostId,
  journalpoststatus,
  vedlegg,
  isSelected,
  showVedlegg,
  toggleShowVedlegg,
  hasVedlegg,
  children,
  ...props
}: AttachmentListItemProps) => (
  <StyledAttachmentListItem
    data-testid="oppgavebehandling-documents-all-list-item"
    data-documentname={vedlegg.tittel}
    {...props}
  >
    <Attachment
      vedlegg={vedlegg}
      journalpostId={journalpostId}
      journalpoststatus={journalpoststatus}
      isSelected={isSelected}
      showVedlegg={showVedlegg}
      toggleShowVedlegg={toggleShowVedlegg}
      hasVedlegg={hasVedlegg}
    />
    {children}
  </StyledAttachmentListItem>
);

AttachmentListItem.displayName = 'AttachmentListItem';
