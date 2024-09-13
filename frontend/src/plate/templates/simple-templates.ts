import { deepFreeze } from '@app/functions/deep-freeze';
import { Source } from '@app/plate/components/label-content';
import { TemplateSections } from '@app/plate/template-sections';
import { TextAlign } from '@app/plate/types';
import { DistribusjonsType } from '@app/types/documents/documents';
import type { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createLabelContent,
  createMaltekstseksjon,
  createPageBreak,
  createSignature,
  createSimpleParagraph,
} from './helpers';

export const GENERELT_BREV_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.GENERELT_BREV,
  tittel: 'Generelt brev',
  richText: [createCurrentDate(), createHeader(), createSimpleParagraph(), createSignature(), createFooter()],
  dokumentTypeId: DistribusjonsType.BREV,
});

export const NOTAT_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.NOTAT,
  tittel: 'Notat',
  richText: [createCurrentDate(), createSimpleParagraph()],
  dokumentTypeId: DistribusjonsType.NOTAT,
});

export const ROL_QUESTIONS_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ROL_QUESTIONS,
  tittel: 'Spørsmål til rådgivende overlege',
  richText: [
    createCurrentDate(),
    createMaltekstseksjon(TemplateSections.TITLE),
    {
      type: ELEMENT_PARAGRAPH,
      align: TextAlign.LEFT,
      children: [
        createLabelContent(Source.SAKEN_GJELDER_NAME, 'Navn'),
        createLabelContent(Source.SAKEN_GJELDER_FNR, 'Fødselsnummer'),
        createLabelContent(Source.YTELSE, 'Ytelse'),
        createLabelContent(Source.SAKSNUMMER, 'Saksnummer'),
      ],
    },
    createMaltekstseksjon(TemplateSections.INTRODUCTION_TEMP),
    createMaltekstseksjon(TemplateSections.FREMLEGG),
    createSignature(),
  ],
  dokumentTypeId: DistribusjonsType.NOTAT,
});

export const ROL_ANSWERS_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ROL_ANSWERS,
  tittel: 'Svar fra rådgivende overlege',
  richText: [
    createCurrentDate(),
    createMaltekstseksjon(TemplateSections.TITLE),
    createMaltekstseksjon(TemplateSections.SVAR_FRA_ROL),
    createSignature(),
  ],
  dokumentTypeId: DistribusjonsType.NOTAT,
});

export const ROL_TILSVARSBREV_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ROL_TILSVARSBREV,
  tittel: 'Tilsvarsbrev (ROL)',
  richText: [
    createCurrentDate(),
    createMaltekstseksjon(TemplateSections.TILSVARSRETT),
    createMaltekstseksjon(TemplateSections.GENERELL_INFO),
    createPageBreak(),
    createMaltekstseksjon(TemplateSections.VEDLEGG),
  ],
  dokumentTypeId: DistribusjonsType.BREV,
});
