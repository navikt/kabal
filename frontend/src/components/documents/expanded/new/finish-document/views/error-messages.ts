import { DocumentValidationErrorType } from '../../../../../../types/documents/common-params';

export const ERROR_MESSAGES: Record<DocumentValidationErrorType, string> = {
  [DocumentValidationErrorType.EMPTY_PLACEHOLDERS]: 'Alle plassholdere må fylles ut',
};
