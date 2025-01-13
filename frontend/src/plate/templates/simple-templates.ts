import { deepFreeze } from '@app/functions/deep-freeze';
import { TemplateSections } from '@app/plate/template-sections';
import { TextAlign } from '@app/plate/types';
import { DistribusjonsType } from '@app/types/documents/documents';
import type { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import type { Immutable } from '@app/types/types';
import { BaseParagraphPlugin } from '@udecode/plate-core';
import { LabelContentSource } from '../types';
import {
  createCurrentDate,
  createFooter,
  createFullmektig,
  createHeader,
  createLabelContent,
  createMaltekstseksjon,
  createPageBreak,
  createSignature,
  createSimpleParagraph,
} from './helpers';

const getGenereltBrevTemplate = (includeMedunderskriver: boolean): Immutable<IMutableSmartEditorTemplate> =>
  deepFreeze({
    templateId: TemplateIdEnum.GENERELT_BREV,
    tittel: 'Generelt brev',
    richText: [
      createCurrentDate(),
      createHeader(),
      createSimpleParagraph(),
      createSignature(includeMedunderskriver),
      createFooter(),
    ],
    dokumentTypeId: DistribusjonsType.BREV,
  });

export const GENERELT_BREV_TEMPLATE = getGenereltBrevTemplate(true);
export const GENERELT_BREV_WITHOUT_MU_TEMPLATE = getGenereltBrevTemplate(false);

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
      type: BaseParagraphPlugin.key,
      align: TextAlign.LEFT,
      children: [
        createLabelContent(LabelContentSource.SAKEN_GJELDER_NAME),
        createLabelContent(LabelContentSource.SAKEN_GJELDER_FNR),
        createLabelContent(LabelContentSource.YTELSE),
        createLabelContent(LabelContentSource.SAKSNUMMER),
      ],
    },
    createMaltekstseksjon(TemplateSections.INTRODUCTION_V2),
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
    createMaltekstseksjon(TemplateSections.TITLE),
    {
      type: BaseParagraphPlugin.key,
      align: TextAlign.LEFT,
      children: [
        createLabelContent(LabelContentSource.KLAGER_IF_EQUAL_TO_SAKEN_GJELDER_NAME),
        createLabelContent(LabelContentSource.SAKEN_GJELDER_IF_DIFFERENT_FROM_KLAGER_NAME),
        createLabelContent(LabelContentSource.SAKEN_GJELDER_FNR),
        createLabelContent(LabelContentSource.KLAGER_IF_DIFFERENT_FROM_SAKEN_GJELDER_NAME),
        createFullmektig(),
        createLabelContent(LabelContentSource.SAKSNUMMER),
      ],
    },
    createMaltekstseksjon(TemplateSections.TILSVARSRETT_V3),
    createMaltekstseksjon(TemplateSections.GENERELL_INFO),
    createPageBreak(),
    createMaltekstseksjon(TemplateSections.VEDLEGG),
  ],
  dokumentTypeId: DistribusjonsType.BREV,
});
