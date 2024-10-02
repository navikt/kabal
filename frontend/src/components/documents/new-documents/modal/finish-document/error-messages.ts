import { DocumentValidationErrorType } from '@app/types/documents/validation';

export const VALIDATION_ERROR_MESSAGES: Record<DocumentValidationErrorType, string> = {
  [DocumentValidationErrorType.EMPTY_PLACEHOLDER]:
    'Alle innfyllingsfelt må fylles ut eller fjernes før du kan ferdigstille dokumentet under arbeid. Tomme innfyllingsfelt er markert med rødt i forhåndsvisningen.',
  [DocumentValidationErrorType.EMPTY_REGELVERK]: 'Regelverk må settes inn',
  [DocumentValidationErrorType.WRONG_DATE]: 'Dokumentet har feil dato',
  [DocumentValidationErrorType.DOCUMENT_MODIFIED]: 'Dokumentet har nylig blitt endret',
  [DocumentValidationErrorType.INVALID_RECIPIENT]: 'Ugyldig mottaker',
};
