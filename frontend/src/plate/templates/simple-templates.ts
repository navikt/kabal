import { deepFreeze } from '@app/functions/deep-freeze';
import { DistribusjonsType } from '@app/types/documents/documents';
import { IMutableSmartEditorTemplate, TemplateTypeEnum } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { createCurrentDate, createFooter, createHeader, createSignature, createSimpleParagraph } from './helpers';

export const GENERELT_BREV_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.GENERELT_BREV,
  type: TemplateTypeEnum.GENERELL,
  tittel: 'Generelt brev',
  content: [createCurrentDate(), createHeader(), createSimpleParagraph(), createSignature(), createFooter()],
  dokumentTypeId: DistribusjonsType.BREV,
});

export const NOTAT_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.NOTAT,
  type: TemplateTypeEnum.NOTAT,
  tittel: 'Notat',
  content: [createCurrentDate(), createSimpleParagraph()],
  dokumentTypeId: DistribusjonsType.NOTAT,
});

export const ROL_QUESTIONS_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ROL_QUESTIONS,
  type: TemplateTypeEnum.NOTAT,
  tittel: 'Spørsmål til rådgivende overlege',
  content: [createCurrentDate(), createSimpleParagraph()],
  dokumentTypeId: DistribusjonsType.NOTAT,
});

export const ROL_ANSWERS_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ROL_ANSWERS,
  type: TemplateTypeEnum.NOTAT,
  tittel: 'Svar fra rådgivende overlege',
  content: [createCurrentDate(), createSimpleParagraph()],
  dokumentTypeId: DistribusjonsType.NOTAT,
});
