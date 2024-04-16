import { deepFreeze } from '@app/functions/deep-freeze';
import { TemplateSections } from '@app/plate/template-sections';
import { DistribusjonsType } from '@app/types/documents/documents';
import { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Language } from '@app/types/texts/common';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createMaltekstseksjon,
  createPageBreak,
  createSignature,
  createSimpleParagraph,
} from './helpers';

export const GENERELT_BREV_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.GENERELT_BREV,
  tittel: 'Generelt brev',
  content: [createCurrentDate(), createHeader(), createSimpleParagraph(), createSignature(), createFooter()],
  dokumentTypeId: DistribusjonsType.BREV,
  language: Language.NB,
});

export const NOTAT_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.NOTAT,
  tittel: 'Notat',
  content: [createCurrentDate(), createSimpleParagraph()],
  dokumentTypeId: DistribusjonsType.NOTAT,
  language: Language.NB,
});

export const ROL_QUESTIONS_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ROL_QUESTIONS,
  tittel: 'Spørsmål til rådgivende overlege',
  content: [
    createCurrentDate(),
    createMaltekstseksjon(TemplateSections.TITLE),
    createMaltekstseksjon(TemplateSections.INTRODUCTION),
    createMaltekstseksjon(TemplateSections.FREMLEGG),
    createSignature(),
  ],
  dokumentTypeId: DistribusjonsType.NOTAT,
  language: Language.NB,
});

export const ROL_ANSWERS_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ROL_ANSWERS,
  tittel: 'Svar fra rådgivende overlege',
  content: [
    createCurrentDate(),
    createMaltekstseksjon(TemplateSections.TITLE),
    createMaltekstseksjon(TemplateSections.SVAR_FRA_ROL),
    createSignature(),
  ],
  dokumentTypeId: DistribusjonsType.NOTAT,
  language: Language.NB,
});

export const ROL_TILSVARSBREV_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ROL_TILSVARSBREV,
  tittel: 'Tilsvarsbrev (ROL)',
  content: [
    createCurrentDate(),
    createMaltekstseksjon(TemplateSections.TILSVARSRETT),
    createMaltekstseksjon(TemplateSections.GENERELL_INFO),
    createPageBreak(),
    createMaltekstseksjon(TemplateSections.VEDLEGG),
  ],
  dokumentTypeId: DistribusjonsType.BREV,
  language: Language.NB,
});
