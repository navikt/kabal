import React from 'react';
import { isoDateTimeToPretty } from '../../../../domain/date';
import { IMainDocument } from '../../../../types/documents';
import { AttachmentListItem, StyledAttachmentList } from '../styled-components/attachment-list';
import { DocumentDate } from '../styled-components/document';
import { DocumentListItem } from '../styled-components/document-list';
import { OpenDocumentButton } from './open-document-button';

type Props = {
  attachments: IMainDocument[];
} & IMainDocument;

export const NewDocument = ({ id, opplastet, tittel, attachments }: Props) => (
  <DocumentListItem>
    <DocumentDate>{isoDateTimeToPretty(opplastet)}</DocumentDate>
    <OpenDocumentButton id={id} title={tittel} />
    <StyledAttachmentList data-testid="oppgavebehandling-documents-tilknyttede-list">
      {attachments.map((a) => (
        <AttachmentListItem key={a.id}>
          <OpenDocumentButton id={a.id} title={a.tittel} />
        </AttachmentListItem>
      ))}
    </StyledAttachmentList>
  </DocumentListItem>
);
