import { Skeleton } from '@navikt/ds-react';
import React from 'react';
import { NewDocument } from '@app/components/documents/new-documents/new-document/new-document';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCreateVedleggFromJournalfoertDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { StyledAttachmentList, StyledAttachmentListItem } from '../styled-components/attachment-list';

interface Props {
  parentId: string;
}

export const AttachmentList = ({ parentId }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetDocumentsQuery(oppgaveId);
  const [, { isLoading: isAddingVedlegg }] = useCreateVedleggFromJournalfoertDocumentMutation({
    fixedCacheKey: parentId,
  });

  if (isLoading || typeof data === 'undefined') {
    if (isAddingVedlegg) {
      return (
        <StyledAttachmentList data-testid="new-attachments-list">
          <StyledAttachmentListItem>
            <Skeleton variant="rectangle" />
          </StyledAttachmentListItem>
        </StyledAttachmentList>
      );
    }

    return null;
  }

  const attachments = data.filter((d) => d.parentId === parentId);

  return (
    <StyledAttachmentList data-testid="new-attachments-list">
      {attachments.map((attachment) => (
        <StyledAttachmentListItem
          key={attachment.id}
          data-testid="new-attachments-list-item"
          data-documentname={attachment.tittel}
          data-documentid={attachment.id}
          data-documenttype="attachment"
        >
          <NewDocument document={attachment} />
        </StyledAttachmentListItem>
      ))}
      {isAddingVedlegg ? (
        <StyledAttachmentListItem>
          <Skeleton variant="rectangle" />
        </StyledAttachmentListItem>
      ) : null}
    </StyledAttachmentList>
  );
};
