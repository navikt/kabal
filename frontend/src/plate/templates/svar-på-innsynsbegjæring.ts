import { deepFreeze } from '@app/functions/deep-freeze';
import { TextAlign } from '@app/plate/types';
import { DistribusjonsType } from '@app/types/documents/documents';
import type { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import type { Value } from '@udecode/plate';
import { BaseParagraphPlugin } from '@udecode/plate-core';
import { TemplateSections } from '../template-sections';
import { LabelContentSource } from '../types';
import {
  createCurrentDate,
  createFooter,
  createFullmektig,
  createHeader,
  createLabelContent,
  createMaltekstseksjon,
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
      createLabelContent(LabelContentSource.KLAGER_IF_EQUAL_TO_SAKEN_GJELDER_NAME),
      createLabelContent(LabelContentSource.SAKEN_GJELDER_IF_DIFFERENT_FROM_KLAGER_NAME),
      createLabelContent(LabelContentSource.SAKEN_GJELDER_FNR),
      createLabelContent(LabelContentSource.KLAGER_IF_DIFFERENT_FROM_SAKEN_GJELDER_NAME),
      createFullmektig(),
      createLabelContent(LabelContentSource.SAKSNUMMER),
    ],
  },

  createMaltekstseksjon(TemplateSections.SVAR_PÅ_INNSYNSBEGJÆRING),
  createMaltekstseksjon(TemplateSections.OM_TAUSHETSPLIKT),

  createSignature(),
  createFooter(),
];

export const SVAR_PÅ_INNSYNSBEGJÆRING_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.SVAR_PÅ_INNSYNSBEGJÆRING,
  tittel: 'Svar på innsynsbegjæring',
  richText: INITIAL_SLATE_VALUE,
  dokumentTypeId: DistribusjonsType.BREV,
});
