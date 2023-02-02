import { Button } from '@navikt/ds-react';
import React from 'react';
import styled, { css } from 'styled-components';

const documentsGridCSS = css`
  display: grid;
  grid-column-gap: 8px;
  align-items: center;
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 2px;
  padding-bottom: 2px;
`;

export enum Fields {
  ResetFilters = 'resetFilters',
  Expand = 'expand',
  Title = 'title',
  Meta = 'meta',
  Date = 'date',
  AvsenderMottaker = 'avsendermottaker',
  SaksId = 'saksid',
  Type = 'type',
  Action = 'action',
}

const SIZES: Record<Fields, string> = {
  [Fields.Expand]: '20px',
  [Fields.Title]: 'auto',
  [Fields.Meta]: '140px',
  [Fields.Date]: '85px',
  [Fields.AvsenderMottaker]: '200px',
  [Fields.SaksId]: '98px',
  [Fields.Type]: '82px',
  [Fields.Action]: '32px',
  [Fields.ResetFilters]: '32px',
};

const getFieldNames = (fields: Fields[]): string => fields.join(' ');
const getFieldSizes = (fields: Fields[]): string => fields.map((field) => SIZES[field]).join(' ');

const NEW_DOCUMENT_FIELDS = [Fields.Title, Fields.Meta, Fields.Date, Fields.Action];
export const newDocumentsGridCSS = css`
  ${documentsGridCSS}
  grid-template-columns: ${getFieldSizes(NEW_DOCUMENT_FIELDS)};
  grid-template-areas: '${getFieldNames(NEW_DOCUMENT_FIELDS)}';
`;

const JOURNALFOERTE_DOCUMENT_HEADER_FIELDS = [
  Fields.ResetFilters,
  Fields.Title,
  Fields.Meta,
  Fields.Date,
  Fields.AvsenderMottaker,
  Fields.SaksId,
  Fields.Type,
  Fields.Action,
];
export const journalfoerteDocumentsHeaderGridCSS = css`
  ${documentsGridCSS}
  grid-template-columns: ${getFieldSizes(JOURNALFOERTE_DOCUMENT_HEADER_FIELDS)};
  grid-template-areas: '${getFieldNames(JOURNALFOERTE_DOCUMENT_HEADER_FIELDS)}';
`;

const JOURNALFOERTE_DOCUMENT_FIELDS = [
  Fields.Expand,
  Fields.Title,
  Fields.Meta,
  Fields.Date,
  Fields.AvsenderMottaker,
  Fields.SaksId,
  Fields.Type,
  Fields.Action,
];
export const journalfoerteDocumentsGridCSS = css`
  ${documentsGridCSS}
  grid-template-columns: ${getFieldSizes(JOURNALFOERTE_DOCUMENT_FIELDS)};
  grid-template-areas: '${getFieldNames(JOURNALFOERTE_DOCUMENT_FIELDS)}';
`;

const VEDLEGG_FIELDS = [Fields.Title, Fields.Action];
export const vedleggGridCSS = css`
  ${documentsGridCSS}
  grid-template-columns: ${getFieldSizes(VEDLEGG_FIELDS)};
  grid-template-areas: '${getFieldNames(VEDLEGG_FIELDS)}';
`;

interface StyledClickableFieldProps {
  $area: Fields;
}

export const StyledClickableField = styled(Button)<StyledClickableFieldProps>`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  grid-area: ${({ $area }) => $area};
`;

interface ClickableFieldProps extends StyledClickableFieldProps {
  children: string;
  onClick: () => void;
}

export const ClickableField = (props: ClickableFieldProps) => (
  <StyledClickableField {...props} size="small" variant="tertiary" title={props.children} />
);
