import { css } from 'styled-components';

export const documentsGridCSS = css`
  display: grid;
  grid-column-gap: 8px;
  align-items: center;
  padding-left: 6px;
  padding-right: 0;
`;

export enum Fields {
  SelectRow = 'select-row',
  ResetFilters = 'reset-filters',
  Expand = 'expand',
  Title = 'title',
  Tema = 'tema',
  Date = 'date',
  AvsenderMottaker = 'avsender-mottaker',
  SaksId = 'saksid',
  Type = 'type',
  Action = 'action',
}

const SIZES: Record<Fields, string> = {
  [Fields.Expand]: '20px',
  [Fields.SelectRow]: '20px',
  [Fields.Title]: 'auto',
  [Fields.Tema]: '85px',
  [Fields.Date]: '86px',
  [Fields.AvsenderMottaker]: '200px',
  [Fields.SaksId]: '100px',
  [Fields.Type]: '82px',
  [Fields.Action]: '32px',
  [Fields.ResetFilters]: '32px',
};

export const getFieldNames = (fields: Fields[]): string => fields.join(' ');
export const getFieldSizes = (fields: Fields[]): string => fields.map((field) => SIZES[field]).join(' ');

const EXPANDED_JOURNALFOERTE_DOCUMENT_HEADER_FIELDS = [
  Fields.SelectRow,
  Fields.Title,
  Fields.Tema,
  Fields.Date,
  Fields.AvsenderMottaker,
  Fields.SaksId,
  Fields.Type,
  Fields.Action,
];

export const expandedJournalfoerteDocumentsHeaderGridCSS = css`
  ${documentsGridCSS}
  grid-template-columns: ${getFieldSizes(EXPANDED_JOURNALFOERTE_DOCUMENT_HEADER_FIELDS)};
  grid-template-areas: '${getFieldNames(EXPANDED_JOURNALFOERTE_DOCUMENT_HEADER_FIELDS)}';
`;

const COLLAPSED_JOURNALFOERTE_DOCUMENT_HEADER_FIELDS = [Fields.SelectRow, Fields.Title, Fields.Action];

export const collapsedJournalfoerteDocumentsHeaderGridCSS = css`
  ${documentsGridCSS}
  grid-template-columns: ${getFieldSizes(COLLAPSED_JOURNALFOERTE_DOCUMENT_HEADER_FIELDS)};
  grid-template-areas: '${getFieldNames(COLLAPSED_JOURNALFOERTE_DOCUMENT_HEADER_FIELDS)}';
`;

const EXPANDED_JOURNALFOERTE_DOCUMENT_FIELDS = [
  Fields.SelectRow,
  Fields.Expand,
  Fields.Title,
  Fields.Tema,
  Fields.Date,
  Fields.AvsenderMottaker,
  Fields.SaksId,
  Fields.Type,
  Fields.Action,
];

export const expandedJournalfoerteDocumentsGridCSS = css`
  ${documentsGridCSS}
  grid-template-columns: ${getFieldSizes(EXPANDED_JOURNALFOERTE_DOCUMENT_FIELDS)};
  grid-template-areas: '${getFieldNames(EXPANDED_JOURNALFOERTE_DOCUMENT_FIELDS)}';
`;

const COLLAPSED_JOURNALFOERTE_DOCUMENT_FIELDS = [Fields.SelectRow, Fields.Title, Fields.Action];

export const collapsedJournalfoerteDocumentsGridCSS = css`
  ${documentsGridCSS}
  grid-template-columns: ${getFieldSizes(COLLAPSED_JOURNALFOERTE_DOCUMENT_FIELDS)};
  grid-template-areas: '${getFieldNames(COLLAPSED_JOURNALFOERTE_DOCUMENT_FIELDS)}';
`;
