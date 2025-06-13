export enum Fields {
  Title = 'title',
  TypeOrDate = 'document-type',
  Action = 'action',
}

const SIZES: Record<Fields, number> = {
  [Fields.Title]: -1,
  [Fields.TypeOrDate]: 170,
  [Fields.Action]: 32,
};

export const getFieldNames = (fields: Fields[]): string => fields.join(' ');
export const getFieldSizes = (fields: Fields[]): string => fields.map(toWidth).join(' ');

const toWidth = (field: Fields): string => {
  const size = SIZES[field];

  return size === -1 ? '1fr' : `${size}px`;
};
