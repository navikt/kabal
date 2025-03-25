import { css } from 'styled-components';

export const documentsGridCSS = css`
  display: grid;
  grid-column-gap: var(--a-spacing-2);
  align-items: center;
  padding-left: 6px;
  padding-right: 0;
`;

export enum Fields {
  SelectRow = 'select-row',
  ResetFilters = 'reset-filters',
  ToggleVedlegg = 'toggle-vedlegg',
  ToggleMetadata = 'toggle-metadata',
  Title = 'title',
  Tema = 'tema',
  DatoOpprettet = 'dato-opprettet',
  DatoRegSendt = 'dato-reg-sendt',
  AvsenderMottaker = 'avsender-mottaker',
  Saksnummer = 'saksnummer',
  Type = 'type',
  Action = 'action',
  LogiskeVedlegg = 'logiske-vedlegg',
}

export const SIZES: Record<Fields, [number, number]> = {
  [Fields.SelectRow]: [20, 20],
  [Fields.ToggleVedlegg]: [32, 32],
  [Fields.Title]: [275, -1],
  [Fields.Tema]: [85, 85],
  [Fields.DatoOpprettet]: [185, 185],
  [Fields.DatoRegSendt]: [191, 191],
  [Fields.AvsenderMottaker]: [200, 200],
  [Fields.Saksnummer]: [135, 135],
  [Fields.Type]: [82, 82],
  [Fields.ToggleMetadata]: [32, 32],
  [Fields.Action]: [32, 32],
  [Fields.ResetFilters]: [32, 32],
  [Fields.LogiskeVedlegg]: [0, 0],
};

export const getFieldNames = (fields: Fields[]): string => fields.join(' ');
export const getFieldSizes = (fields: Fields[]): string => fields.map(toWidth).join(' ');

const toWidth = (field: Fields): string => {
  if (field === Fields.LogiskeVedlegg) {
    return '1fr';
  }

  const [minValue, maxValue] = SIZES[field];
  const min = convertToString(minValue);

  if (minValue === maxValue) {
    return min;
  }

  const max = convertToString(maxValue);

  return `minmax(${min}, ${max})`;
};

const convertToString = (n: number): string => (n === -1 ? 'auto' : `${n}px`);
