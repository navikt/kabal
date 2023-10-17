import { deepFreeze } from '@app/functions/deep-freeze';
import { TemplateSections } from '@app/plate/template-sections';
import { DistribusjonsType } from '@app/types/documents/documents';
import { IMutableSmartEditorTemplate, TemplateTypeEnum } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createMaltekst,
  createPageBreak,
  createRedigerbarMaltekst,
  createSignature,
  createSimpleParagraph,
} from './helpers';

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
  content: [
    createCurrentDate(),
    createMaltekst(TemplateSections.TITLE),
    createMaltekst(TemplateSections.INTRODUCTION),
    createRedigerbarMaltekst(TemplateSections.FREMLEGG),
    createSignature(),
  ],
  dokumentTypeId: DistribusjonsType.NOTAT,
});

export const ROL_ANSWERS_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ROL_ANSWERS,
  type: TemplateTypeEnum.NOTAT,
  tittel: 'Svar fra rådgivende overlege',
  content: [
    createCurrentDate(),
    createMaltekst(TemplateSections.TITLE),
    createRedigerbarMaltekst(TemplateSections.SVAR_FRA_ROL),
    createSignature(),
  ],
  dokumentTypeId: DistribusjonsType.NOTAT,
});

export const ROL_TILSVARSBREV_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ROL_TILSVARSBREV,
  type: TemplateTypeEnum.GENERELL,
  tittel: 'Tilsvarsbrev (ROL)',
  content: [
    createCurrentDate(),
    createMaltekst(TemplateSections.TILSVARSRETT),
    createMaltekst(TemplateSections.GENERELL_INFO),
    createPageBreak(),
    createMaltekst(TemplateSections.VEDLEGG),
  ],
  dokumentTypeId: DistribusjonsType.BREV,
});
