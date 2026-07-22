import { hasTrFields } from '@/components/documents/new-documents/has-tr-fields';
import type { ValidationError } from '@/components/documents/new-documents/modal/finish-document/types';
import { DistribusjonsType, DocumentTypeEnum, type IParentDocument } from '@/types/documents/documents';
import { DocumentValidationFrontendError } from '@/types/documents/validation';

export const useValidationErrors = (
  document: IParentDocument,
  innsendingshjemlerConfirmed: boolean,
  klagevedtakDatoConfirmed: boolean,
  isArchiveOnly: boolean,
): ValidationError['errors'] => {
  const validationErrors: ValidationError['errors'] = [];

  if (document.isMarkertAvsluttet) {
    validationErrors.push(
      isArchiveOnly
        ? DocumentValidationFrontendError.ALREADY_ARCHIVING
        : DocumentValidationFrontendError.ALREADY_SENDING,
    );
  }

  if (
    document.dokumentTypeId === DistribusjonsType.ANNEN_INNGAAENDE_POST &&
    document.type === DocumentTypeEnum.UPLOADED &&
    (document.avsender === null || document.inngaaendeKanal === null)
  ) {
    validationErrors.push(DocumentValidationFrontendError.MISSING_AVSENDER_OR_KANAL);
  } else if (hasTrFields(document)) {
    if (!innsendingshjemlerConfirmed) {
      validationErrors.push(DocumentValidationFrontendError.INNSENDINGSHJEMLER_NOT_CONFIRMED);
    }

    if (!klagevedtakDatoConfirmed) {
      validationErrors.push(DocumentValidationFrontendError.KLAGEVEDTAK_DATO_NOT_CONFIRMED);
    }
  }

  return validationErrors;
};
