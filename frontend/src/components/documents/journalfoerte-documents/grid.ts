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
  Saksnummer = 'saksnummer',
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
  [Fields.Saksnummer]: '135px',
  [Fields.Type]: '82px',
  [Fields.Action]: '32px',
  [Fields.ResetFilters]: '32px',
};

export const getFieldNames = (fields: Fields[]): string => fields.join(' ');
export const getFieldSizes = (fields: Fields[]): string => fields.map((field) => SIZES[field]).join(' ');
