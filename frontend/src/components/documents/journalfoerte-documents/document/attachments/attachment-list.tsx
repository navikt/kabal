import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { memo, useContext } from 'react';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { StyledAttachmentList, StyledAttachmentListItem } from '../../../styled-components/attachment-list';
import { Attachment } from './attachment';

interface Props {
  oppgaveId: string | typeof skipToken;
  document: IArkivertDocument;
}

export const AttachmentList = memo(
  ({ oppgaveId, document }: Props) => {
    const { isSelected } = useContext(SelectContext);

    if (document.vedlegg.length === 0 || typeof oppgaveId !== 'string') {
      return null;
    }

    return (
      <StyledAttachmentList data-testid="oppgavebehandling-documents-all-vedlegg-list">
        {document.vedlegg.map((vedlegg) => (
          <AttachmentListItem
            key={`vedlegg_${document.journalpostId}_${vedlegg.dokumentInfoId}`}
            oppgaveId={oppgaveId}
            journalpostId={document.journalpostId}
            vedlegg={vedlegg}
            isSelected={isSelected({ journalpostId: document.journalpostId, dokumentInfoId: vedlegg.dokumentInfoId })}
          />
        ))}
      </StyledAttachmentList>
    );
  },
  (prevProps, nextProps) =>
    prevProps.document.vedlegg.length === nextProps.document.vedlegg.length &&
    prevProps.document.vedlegg.every((v, index) => {
      const n = nextProps.document.vedlegg[index];

      if (n === undefined) {
        return false;
      }

      return v.valgt === n.valgt && v.tittel === n.tittel && v.dokumentInfoId === n.dokumentInfoId;
    })
);

AttachmentList.displayName = 'AttachmentList';

interface AttachmentListItemProps {
  oppgaveId: string;
  journalpostId: string;
  vedlegg: IArkivertDocument['vedlegg'][0];
  isSelected: boolean;
}

const AttachmentListItem = memo(
  ({ oppgaveId, journalpostId, vedlegg, isSelected }: AttachmentListItemProps) => (
    <StyledAttachmentListItem
      data-testid="oppgavebehandling-documents-all-list-item"
      data-documentname={vedlegg.tittel}
    >
      <Attachment
        oppgavebehandlingId={oppgaveId}
        vedlegg={vedlegg}
        journalpostId={journalpostId}
        isSelected={isSelected}
      />
    </StyledAttachmentListItem>
  ),
  (prevProps, nextProps) =>
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.vedlegg.valgt === nextProps.vedlegg.valgt &&
    prevProps.vedlegg.tittel === nextProps.vedlegg.tittel
);

AttachmentListItem.displayName = 'AttachmentListItem';
