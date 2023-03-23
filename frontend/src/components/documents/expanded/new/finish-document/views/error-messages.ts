import { DocumentValidationErrorType } from '@app/types/documents/validation';

export const ERROR_MESSAGES: Record<DocumentValidationErrorType, string> = {
  [DocumentValidationErrorType.EMPTY_PLACEHOLDERS]: 'Alle innfyllingsfelt må fylles ut',
};
