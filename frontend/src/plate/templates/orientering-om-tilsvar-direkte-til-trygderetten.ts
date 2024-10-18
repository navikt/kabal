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
      createLabelContent(Source.KLAGER_IF_EQUAL_TO_SAKEN_GJELDER_NAME, 'Den ankende part'),
      createLabelContent(Source.SAKEN_GJELDER_IF_DIFFERENT_FROM_KLAGER_NAME, 'Saken gjelder'),
      createLabelContent(Source.SAKEN_GJELDER_FNR, 'Fødselsnummer'),
      createLabelContent(Source.KLAGER_IF_DIFFERENT_FROM_SAKEN_GJELDER_NAME, 'Den ankende part'),
      createLabelContent(Source.SAKSNUMMER, 'Saksnummer'),
    ],
  },

  createMaltekstseksjon(TemplateSections.TILSVARSRETT),

  createSignature(),
  createFooter(),
];

export const ORIENTERING_OM_TILSVAR_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ORIENTERING_OM_TILSVAR,
  tittel: 'Orientering om tilsvar direkte til Trygderetten',
  richText: INITIAL_SLATE_VALUE,
  dokumentTypeId: DistribusjonsType.BREV,
});
