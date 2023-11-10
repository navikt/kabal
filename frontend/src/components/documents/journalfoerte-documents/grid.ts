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
  DatoOpprettet = 'dato-opprettet',
  DatoRegSendt = 'dato-reg-sendt',
  AvsenderMottaker = 'avsender-mottaker',
  Saksnummer = 'saksnummer',
  Type = 'type',
  Action = 'action',
}

export const SIZES: Record<Fields, number> = {
  [Fields.Expand]: 20,
  [Fields.SelectRow]: 20,
  [Fields.Title]: -1,
  [Fields.Tema]: 85,
  [Fields.DatoOpprettet]: 156,
  [Fields.DatoRegSendt]: 161,
  [Fields.AvsenderMottaker]: 200,
  [Fields.Saksnummer]: 135,
  [Fields.Type]: 82,
  [Fields.Action]: 32,
  [Fields.ResetFilters]: 32,
};

export const getFieldNames = (fields: Fields[]): string => fields.join(' ');
export const getFieldSizes = (fields: Fields[]): string => fields.map(toWidth).join(' ');

const toWidth = (field: Fields): string => {
  const size = SIZES[field];

  return size === -1 ? 'auto' : `${size}px`;
};
