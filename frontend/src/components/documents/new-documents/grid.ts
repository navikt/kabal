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

export const COLLAPSED_NEW_DOCUMENT_FIELDS = [Fields.Title, Fields.Action];
export const EXPANDED_NEW_DOCUMENT_FIELDS = [Fields.Title, Fields.TypeOrDate, Fields.Action];
export const EXPANDED_NEW_ATTACHMENT_FIELDS = [Fields.Title, Fields.TypeOrDate, Fields.Action];
