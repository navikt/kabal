import { DistribusjonsType, DocumentTypeEnum, type IParentDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

export const useFinishValidationErrors = (
  document: IParentDocument,
  innsendingshjemlerConfirmed: boolean,
  isArchiveOnly: boolean,
) => {
  const validationErrors: string[] = [];

  if (document.isMarkertAvsluttet) {
    validationErrors.push(
      isArchiveOnly ? 'Dokumentet er under journalføring.' : 'Dokumentet er under journalføring og utsending.',
    );
  }

  if (
    document.dokumentTypeId === DistribusjonsType.ANNEN_INNGAAENDE_POST &&
    document.type === DocumentTypeEnum.UPLOADED &&
    (document.avsender === null || document.inngaaendeKanal === null)
  ) {
    validationErrors.push('Kan ikke arkiveres før avsender og inngående kanal er satt.');
  } else if (document.templateId === TemplateIdEnum.EKSPEDISJONSBREV_TIL_TRYGDERETTEN && !innsendingshjemlerConfirmed) {
    validationErrors.push('Kan ikke sendes ut før det er bekreftet at innsendingshjemlene stemmer.');
  }

  return validationErrors;
};
