import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { memo, useContext } from 'react';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { IJournalpost } from '@app/types/arkiverte-documents';
import { StyledAttachmentList, StyledAttachmentListItem } from '../../../styled-components/attachment-list';
import { Attachment } from './attachment';

interface Props {
  oppgaveId: string | typeof skipToken;
  journalpost: IJournalpost;
}

export const AttachmentList = memo(
  ({ oppgaveId, journalpost }: Props) => {
    const { isSelected } = useContext(SelectContext);

    if (journalpost.vedlegg.length === 0 || typeof oppgaveId !== 'string') {
      return null;
    }

    return (
      <StyledAttachmentList data-testid="oppgavebehandling-documents-all-vedlegg-list">
        {journalpost.vedlegg.map(({ dokumentInfoId }) => (
          <AttachmentListItem
            key={`vedlegg_${journalpost.journalpostId}_${dokumentInfoId}`}
            oppgaveId={oppgaveId}
            journalpostId={journalpost.journalpostId}
            dokumentInfoId={dokumentInfoId}
            isSelected={isSelected({ journalpostId: journalpost.journalpostId, dokumentInfoId })}
          />
        ))}
      </StyledAttachmentList>
    );
  },
  (prevProps, nextProps) =>
    prevProps.journalpost.vedlegg.length === nextProps.journalpost.vedlegg.length &&
    prevProps.journalpost.vedlegg.every((v, index) => {
      const n = nextProps.journalpost.vedlegg[index];

      return v === n;
    }),
);

AttachmentList.displayName = 'AttachmentList';

interface AttachmentListItemProps {
  oppgaveId: string;
  journalpostId: string;
  dokumentInfoId: string;
  isSelected: boolean;
}

const AttachmentListItem = memo(
  ({ oppgaveId, journalpostId, dokumentInfoId, isSelected }: AttachmentListItemProps) => (
    <StyledAttachmentListItem data-testid="oppgavebehandling-documents-all-list-item">
      <Attachment
        oppgavebehandlingId={oppgaveId}
        dokumentInfoId={dokumentInfoId}
        journalpostId={journalpostId}
        isSelected={isSelected}
      />
    </StyledAttachmentListItem>
  ),
  (prevProps, nextProps) =>
    prevProps.isSelected === nextProps.isSelected && prevProps.dokumentInfoId === nextProps.dokumentInfoId,
);

AttachmentListItem.displayName = 'AttachmentListItem';
