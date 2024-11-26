import { deepFreeze } from '@app/functions/deep-freeze';
import { Source } from '@app/plate/components/label-content';
import {
  createCurrentDate,
  createFooter,
  createFullmektig,
  createHeader,
  createLabelContent,
  createMaltekstseksjon,
  createPageBreak,
  createRegelverk,
  createSignature,
} from '@app/plate/templates/helpers';
import { TextAlign } from '@app/plate/types';
import { DistribusjonsType } from '@app/types/documents/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import type { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { BaseParagraphPlugin } from '@udecode/plate-core';
import { TemplateSections } from '../template-sections';

export const OVERSENDELSESBREV_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.OVERSENDELSESBREV,
  type: SaksTypeEnum.ANKE,
  tittel: 'Tilsvarsbrev med oversendelsesbrev',
  richText: [
    createCurrentDate(),
    createHeader(),

    createMaltekstseksjon(TemplateSections.TILSVARSBREV_TITLE),

    {
      type: BaseParagraphPlugin.key,
      align: TextAlign.LEFT,
      children: [
        createLabelContent(Source.KLAGER_IF_EQUAL_TO_SAKEN_GJELDER_NAME),
        createLabelContent(Source.SAKEN_GJELDER_IF_DIFFERENT_FROM_KLAGER_NAME),
        createLabelContent(Source.SAKEN_GJELDER_FNR),
        createLabelContent(Source.KLAGER_IF_DIFFERENT_FROM_SAKEN_GJELDER_NAME),
        createFullmektig(),
        createLabelContent(Source.SAKSNUMMER),
      ],
    },

    createMaltekstseksjon(TemplateSections.TILSVARSRETT_V2),
    createMaltekstseksjon(TemplateSections.GENERELL_INFO),

    createSignature(),

    createPageBreak(),

    createCurrentDate(),

    createMaltekstseksjon(TemplateSections.TITLE),

    {
      type: BaseParagraphPlugin.key,
      align: TextAlign.LEFT,
      children: [
        createLabelContent(Source.SAKEN_GJELDER_NAME),
        createLabelContent(Source.SAKEN_GJELDER_FNR),
        createLabelContent(Source.SAKSNUMMER),
      ],
    },

    createMaltekstseksjon(TemplateSections.INTRODUCTION_V2),
    createMaltekstseksjon(TemplateSections.ANFOERSLER),
    createMaltekstseksjon(TemplateSections.OPPLYSNINGER),
    createMaltekstseksjon(TemplateSections.VURDERINGEN),

    createSignature(),
    createFooter(),
    createRegelverk(),
  ],
  dokumentTypeId: DistribusjonsType.BREV,
});
