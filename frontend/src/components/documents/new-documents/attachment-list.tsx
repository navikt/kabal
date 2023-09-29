import React, { useMemo } from 'react';
import { styled } from 'styled-components';
import { NewAttachmentButtons } from '@app/components/documents/new-documents/new-attachment-buttons';
import { NewDocument } from '@app/components/documents/new-documents/new-document/new-document';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import {
  DocumentTypeEnum,
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

interface Props {
  parentDocument: IMainDocument;
}

export const AttachmentList = ({ parentDocument }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetDocumentsQuery(oppgaveId);
  const [isExpanded] = useIsExpanded();

  const attachments = useMemo<[(IFileDocument | ISmartDocument)[], IJournalfoertDokumentReference[]]>(() => {
    if (data === undefined) {
      return [[], []];
    }

    const pdfOrSmartDocuments: (IFileDocument | ISmartDocument)[] = [];
    const journalfoertDocumentReferences: IJournalfoertDokumentReference[] = [];

    for (const doc of data) {
      if (doc.parentId === parentDocument.id) {
        if (doc.type === DocumentTypeEnum.JOURNALFOERT) {
          journalfoertDocumentReferences.push(doc);
        } else {
          pdfOrSmartDocuments.push(doc);
        }
      }
    }

    return [
      pdfOrSmartDocuments.sort((a, b) => b.created.localeCompare(a.created)),
      journalfoertDocumentReferences.sort((a, b) =>
        b.journalfoertDokumentReference.datoOpprettet.localeCompare(a.journalfoertDokumentReference.datoOpprettet),
      ),
    ];
  }, [data, parentDocument.id]);

  const [pdfOrSmartDocuments, journalfoertDocumentReferences] = attachments;

  const hasAttachments = pdfOrSmartDocuments.length !== 0 || journalfoertDocumentReferences.length !== 0;

  if (isLoading || typeof data === 'undefined') {
    return (
      <NewDocAttachmentsContainer $showTreeLine={hasAttachments}>
        {isExpanded ? <NewAttachmentButtons document={parentDocument} /> : null}
      </NewDocAttachmentsContainer>
    );
  }

  return (
    <NewDocAttachmentsContainer $showTreeLine={hasAttachments}>
      {isExpanded ? <NewAttachmentButtons document={parentDocument} /> : null}
      <StyledAttachmentList data-testid="new-attachments-list">
        {pdfOrSmartDocuments.map((attachment) => (
          <Attachment key={attachment.id} attachment={attachment} />
        ))}

        {pdfOrSmartDocuments.length === 0 || journalfoertDocumentReferences.length === 0 ? null : <StyledHr />}

        {journalfoertDocumentReferences.map((attachment) => (
          <Attachment key={attachment.id} attachment={attachment} />
        ))}
      </StyledAttachmentList>
    </NewDocAttachmentsContainer>
  );
};

interface AttachmentProps {
  attachment: IMainDocument;
}

const Attachment = ({ attachment }: AttachmentProps) => (
  <StyledAttachmentListItem
    key={attachment.id}
    data-testid="new-attachments-list-item"
    data-documentname={attachment.tittel}
    data-documentid={attachment.id}
    data-documenttype="attachment"
  >
    <NewDocument document={attachment} />
  </StyledAttachmentListItem>
);

const StyledHr = styled.div`
  position: relative;
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
