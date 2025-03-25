import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import type { HTMLProps } from 'react';
import { StyledAttachmentListItem } from '../../../styled-components/attachment-list';
import { Attachment } from './attachment';

interface AttachmentListItemProps extends HTMLProps<HTMLLIElement> {
  journalpostId: string;
  vedlegg: IArkivertDocument['vedlegg'][0];
  isSelected: boolean;
  showVedlegg: boolean;
  toggleShowVedlegg: () => void;
  hasVedlegg: boolean;
  index: number;
  dokumentIndex: number;
  children?: React.ReactNode;
}

export const AttachmentListItem = ({
  journalpostId,
  vedlegg,
  isSelected,
  showVedlegg,
  toggleShowVedlegg,
  hasVedlegg,
  index,
  dokumentIndex,
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
      isSelected={isSelected}
      showVedlegg={showVedlegg}
      toggleShowVedlegg={toggleShowVedlegg}
      hasVedlegg={hasVedlegg}
      index={index}
      dokumentIndex={dokumentIndex}
    />
    {children}
  </StyledAttachmentListItem>
);

AttachmentListItem.displayName = 'AttachmentListItem';
