export enum Fields {
  Select = 'select',
  ToggleVedlegg = 'toggle-vedlegg',
  ToggleMetadata = 'toggle-metadata',
  Title = 'title',
  Tema = 'tema',
  DatoOpprettet = 'dato-opprettet',
  DatoSortering = 'dato-sortering',
  AvsenderMottaker = 'avsender-mottaker',
  Saksnummer = 'saksnummer',
  Type = 'type',
  Action = 'action',
  LogiskeVedlegg = 'logiske-vedlegg',
}

/**
 * The column sizes. First number is the minimum size, second is the maximum size.
 * `-1` means `auto`.
 * */
export const SIZES: Record<Fields, [number, number]> = {
  [Fields.Select]: [20, 20],
  [Fields.ToggleVedlegg]: [32, 32],
  [Fields.Title]: [275, -1],
  [Fields.Tema]: [110, 110],
  [Fields.DatoOpprettet]: [190, 190],
  [Fields.DatoSortering]: [191, 191],
  [Fields.AvsenderMottaker]: [200, 200],
  [Fields.Saksnummer]: [135, 135],
  [Fields.Type]: [82, 82],
  [Fields.ToggleMetadata]: [32, 32],
  [Fields.Action]: [32, 32],
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
