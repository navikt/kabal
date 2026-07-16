// Caught by backend
export enum DocumentValidationApiError {
  WRONG_DATE = 'WRONG_DATE',
  EMPTY_PLACEHOLDER = 'EMPTY_PLACEHOLDER',
  EMPTY_REGELVERK = 'EMPTY_REGELVERK',
  DOCUMENT_MODIFIED = 'DOCUMENT_MODIFIED',
  KLAGEVEDTAK_DATO_NOT_SET = 'KLAGEVEDTAK_DATO_NOT_SET',
  FORSTERKET_RETT_NOT_SET = 'FORSTERKET_RETT_NOT_SET',
  INVALID_RECEIVER = 'INVALID_RECEIVER',
}

// Caught by frontend
export enum DocumentValidationFrontendError {
  NO_RECEIVERS = 'NO_RECEIVERS',
  MISSING_AVSENDER_OR_KANAL = 'MISSING_AVSENDER_OR_KANAL',
  KLAGEVEDTAK_DATO_NOT_CONFIRMED = 'KLAGEVEDTAK_DATO_NOT_CONFIRMED',
  INNSENDINGSHJEMLER_NOT_CONFIRMED = 'INNSENDINGSHJEMLER_NOT_CONFIRMED',
  ALREADY_SENDING = 'ALREADY_SENDING',
  ALREADY_ARCHIVING = 'ALREADY_ARCHIVING',
}

interface IDocumentValidationError {
  dokumentId: string;
  errors: DocumentValidationApiError[];
}

export type IValidateDocumentResponse = IDocumentValidationError[];

type DocumentValidationError = DocumentValidationApiError | DocumentValidationFrontendError;

// The type annotation requires every member of both enums as a key. Only enum member keys are allowed.
const DOCUMENT_VALIDATION_ERROR_ORDER_MAP: Record<DocumentValidationError, number> = {
  // Document errors
  [DocumentValidationApiError.WRONG_DATE]: 0,
  [DocumentValidationApiError.EMPTY_PLACEHOLDER]: 1,
  [DocumentValidationApiError.EMPTY_REGELVERK]: 2,
  [DocumentValidationApiError.DOCUMENT_MODIFIED]: 3,

  // Document metadata errors
  [DocumentValidationApiError.KLAGEVEDTAK_DATO_NOT_SET]: 4,
  [DocumentValidationFrontendError.KLAGEVEDTAK_DATO_NOT_CONFIRMED]: 5,
  [DocumentValidationApiError.FORSTERKET_RETT_NOT_SET]: 6,
  [DocumentValidationFrontendError.INNSENDINGSHJEMLER_NOT_CONFIRMED]: 7,

  // Document receivers errors
  [DocumentValidationApiError.INVALID_RECEIVER]: 8,
  [DocumentValidationFrontendError.NO_RECEIVERS]: 9,
  [DocumentValidationFrontendError.MISSING_AVSENDER_OR_KANAL]: 10,

  // Finishing errors
  [DocumentValidationFrontendError.ALREADY_SENDING]: 11,
  [DocumentValidationFrontendError.ALREADY_ARCHIVING]: 12,
};

export const DOCUMENT_VALIDATION_ERROR_ORDER = typedKeys(DOCUMENT_VALIDATION_ERROR_ORDER_MAP).toSorted(
  (a, b) => DOCUMENT_VALIDATION_ERROR_ORDER_MAP[a] - DOCUMENT_VALIDATION_ERROR_ORDER_MAP[b],
);

// `Object.keys` always returns `string[]`, so this narrows it back to the record's actual keys.
function typedKeys<T extends Record<string, unknown>>(record: T): (keyof T)[] {
  return Object.keys(record) as (keyof T)[];
}
