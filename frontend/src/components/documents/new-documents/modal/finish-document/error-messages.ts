import { DocumentValidationApiError, DocumentValidationFrontendError } from '@/types/documents/validation';

export const VALIDATION_ERROR_MESSAGES: Record<DocumentValidationApiError | DocumentValidationFrontendError, string> = {
  [DocumentValidationApiError.WRONG_DATE]: 'Dokumentet har feil dato',
  [DocumentValidationApiError.EMPTY_PLACEHOLDER]:
    'Tomme innfyllingsfelt, markert med rødt i forhåndsvisningen, må fylles ut eller fjernes',
  [DocumentValidationApiError.EMPTY_REGELVERK]: 'Regelverk må settes inn',
  [DocumentValidationApiError.DOCUMENT_MODIFIED]: 'Dokumentet har nylig blitt endret',
  [DocumentValidationApiError.KLAGEVEDTAK_DATO_NOT_SET]: 'Dato for klagevedtak må settes',
  [DocumentValidationApiError.FORSTERKET_RETT_NOT_SET]: 'Spørsmålet om forsterket rett må besvares',
  [DocumentValidationApiError.INVALID_RECEIVER]: 'Ugyldig mottaker',

  [DocumentValidationFrontendError.NO_RECEIVERS]: 'Dokumentet har ingen mottakere',
  [DocumentValidationFrontendError.MISSING_AVSENDER_OR_KANAL]:
    'Avsender og inngående kanal må settes før dokumentet kan arkiveres',
  [DocumentValidationFrontendError.INNSENDINGSHJEMLER_NOT_CONFIRMED]:
    'Innsendingshjemlene må bekreftes før dokumentet kan sendes ut',
  [DocumentValidationFrontendError.KLAGEVEDTAK_DATO_NOT_CONFIRMED]:
    'Dato for klagevedtaket må bekreftes før dokumentet kan sendes ut',
  [DocumentValidationFrontendError.ALREADY_SENDING]: 'Dokumentet er allerede under utsending',
  [DocumentValidationFrontendError.ALREADY_ARCHIVING]: 'Dokumentet er allerede under arkivering',
};
