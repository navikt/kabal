import { css } from 'styled-components';

const documentsGridCSS = css`
  display: grid;
  grid-column-gap: 8px;
  align-items: center;
  padding-left: 6px;
  padding-right: 0;
`;

export enum Fields {
  Title = 'title',
  DocumentType = 'document-type',
  Date = 'date',
  Action = 'action',
}

const SIZES: Record<Fields, string> = {
  [Fields.Title]: 'auto',
  [Fields.DocumentType]: '160px',
  [Fields.Date]: '86px',
  [Fields.Action]: '32px',
};

const getFieldNames = (fields: Fields[]): string => fields.join(' ');
const getFieldSizes = (fields: Fields[]): string => fields.map((field) => SIZES[field]).join(' ');

const COLLAPSED_NEW_DOCUMENT_FIELDS = [Fields.Title, Fields.Action];

export const collapsedNewDocumentsGridCSS = css`
  ${documentsGridCSS}
  grid-template-columns: ${getFieldSizes(COLLAPSED_NEW_DOCUMENT_FIELDS)};
  grid-template-areas: '${getFieldNames(COLLAPSED_NEW_DOCUMENT_FIELDS)}';
`;
const EXPANDED_NEW_DOCUMENT_FIELDS = [Fields.Title, Fields.DocumentType, Fields.Date, Fields.Action];

export const expandedNewDocumentsGridCSS = css`
  ${documentsGridCSS}
  grid-template-columns: ${getFieldSizes(EXPANDED_NEW_DOCUMENT_FIELDS)};
  grid-template-areas: '${getFieldNames(EXPANDED_NEW_DOCUMENT_FIELDS)}';
`;
