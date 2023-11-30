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

export const SIZES: Record<Fields, [number, number]> = {
  [Fields.Expand]: [20, 20],
  [Fields.SelectRow]: [20, 20],
  [Fields.Title]: [200, -1],
  [Fields.Tema]: [85, 85],
  [Fields.DatoOpprettet]: [164, 164],
  [Fields.DatoRegSendt]: [171, 171],
  [Fields.AvsenderMottaker]: [200, 200],
  [Fields.Saksnummer]: [135, 135],
  [Fields.Type]: [82, 82],
  [Fields.Action]: [32, 32],
  [Fields.ResetFilters]: [32, 32],
};

export const getFieldNames = (fields: Fields[]): string => fields.join(' ');
export const getFieldSizes = (fields: Fields[]): string => fields.map(toWidth).join(' ');

const toWidth = (field: Fields): string => {
  const [minValue, maxValue] = SIZES[field];

  const min = minValue === -1 ? 'auto' : `${minValue}px`;
  const max = maxValue === -1 ? 'auto' : `${maxValue}px`;

  return `minmax(${min}, ${max})`;
};
