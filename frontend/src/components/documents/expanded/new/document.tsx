import React from 'react';
import { isoDateTimeToPrettyDate } from '../../../../domain/date';
import { IMainDocument } from '../../../../types/documents';
import { StyledDate } from '../styled-components/document';
import { DocumentTitle } from './document-title';
import { DocumentTypeOrFrikoble } from './document-type-or-frikoble';

interface Props {
  document: IMainDocument;
}

export const Document = ({ document }: Props) => (
  <>
    <DocumentTitle document={document} />
    <DocumentTypeOrFrikoble document={document} />
    <StyledDate>{isoDateTimeToPrettyDate(document.opplastet)}</StyledDate>
  </>
);
