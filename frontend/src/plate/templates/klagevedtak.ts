import { deepFreeze } from '@app/functions/deep-freeze';
import { Source } from '@app/plate/components/label-content';
import { TextAlign } from '@app/plate/types';
import { DistribusjonsType } from '@app/types/documents/documents';
import type { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import type { Value } from '@udecode/plate-common';
import { BaseParagraphPlugin } from '@udecode/plate-core';
import { TemplateSections } from '../template-sections';
import {
  createCurrentDate,
  createFooter,
  createFullmektig,
  createHeader,
  createLabelContent,
  createMaltekstseksjon,
  createRegelverk,
  createSignature,
} from './helpers';

const INITIAL_SLATE_VALUE: Value = [
  createCurrentDate(),
  createHeader(),

  createMaltekstseksjon(TemplateSections.TITLE),

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

  createMaltekstseksjon(TemplateSections.INTRODUCTION_V2),
  createMaltekstseksjon(TemplateSections.AVGJOERELSE),
  createMaltekstseksjon(TemplateSections.ANFOERSLER),
  createMaltekstseksjon(TemplateSections.OPPLYSNINGER),
  createMaltekstseksjon(TemplateSections.VURDERINGEN),
  createMaltekstseksjon(TemplateSections.ANKEINFO),
  createMaltekstseksjon(TemplateSections.SAKSKOSTNADER),
  createMaltekstseksjon(TemplateSections.GENERELL_INFO),

  createSignature(),
  createFooter(),
  createRegelverk(),
];

export const KLAGEVEDTAK_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.KLAGEVEDTAK_V2,
  tittel: 'Vedtak/beslutning (klage)',
  richText: INITIAL_SLATE_VALUE,
  dokumentTypeId: DistribusjonsType.VEDTAKSBREV,
});
