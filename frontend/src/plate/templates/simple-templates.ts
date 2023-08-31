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

export const ROL_NOTAT_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ROL_NOTAT,
  type: TemplateTypeEnum.NOTAT,
  tittel: 'Notat for rådgivende overlege',
  content: [createCurrentDate(), createSimpleParagraph()],
  dokumentTypeId: DistribusjonsType.NOTAT,
});
