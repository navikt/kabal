import { deepFreeze } from '@app/functions/deep-freeze';
import { TextAlign } from '@app/plate/types';
import { DistribusjonsType } from '@app/types/documents/documents';
import type { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { BaseParagraphPlugin } from '@platejs/core';
import type { Value } from 'platejs';
import { DeprecatedTemplateSections, TemplateSections } from '../template-sections';
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

  createMaltekstseksjon(TemplateSections.TILSVARSBREV_TITLE),

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

  createSignature(),
  createFooter(),
];

export const ORIENTERING_OM_TILSVAR_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ORIENTERING_OM_TILSVAR,
  tittel: 'Orientering om tilsvar direkte til Trygderetten',
  richText: INITIAL_SLATE_VALUE,
  dokumentTypeId: DistribusjonsType.BREV,
  deprecatedSections: [DeprecatedTemplateSections.TILSVARSRETT_V2],
});
