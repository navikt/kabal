import type { Value } from 'platejs';
import { deepFreeze } from '@/functions/deep-freeze';
import { TemplateSections } from '@/plate/template-sections';
import {
  createCurrentDate,
  createFooter,
  createFullmektig,
  createHeader,
  createLabelContent,
  createMaltekstseksjon,
  createSaksnummer,
  createSignature,
} from '@/plate/templates/helpers';
import { LabelContentSource } from '@/plate/types';
import { DistribusjonsType } from '@/types/documents/documents';
import type { IMutableSmartEditorTemplate } from '@/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

const INITIAL_SLATE_VALUE: Value = [
  createCurrentDate(),
  createHeader(),

  createMaltekstseksjon(TemplateSections.TITLE),

  createLabelContent(LabelContentSource.KLAGER_IF_EQUAL_TO_SAKEN_GJELDER_NAME),
  createLabelContent(LabelContentSource.SAKEN_GJELDER_IF_DIFFERENT_FROM_KLAGER_NAME),
  createLabelContent(LabelContentSource.SAKEN_GJELDER_FNR),
  createLabelContent(LabelContentSource.KLAGER_IF_DIFFERENT_FROM_SAKEN_GJELDER_NAME),
  createFullmektig(),
  createLabelContent(LabelContentSource.ANKEMOTPART),
  createSaksnummer(),

  createMaltekstseksjon(TemplateSections.INTRODUCTION_V2),
  createMaltekstseksjon(TemplateSections.OM_ETTERSENDING_TIL_TR),

  createSignature(false),
  createFooter(),
];

export const ETTERSENDING_TIL_TRYGDERETTEN_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ETTERSENDING_TIL_TRYGDERETTEN,
  tittel: 'Ettersending til Trygderetten',
  richText: INITIAL_SLATE_VALUE,
  dokumentTypeId: DistribusjonsType.EKSPEDISJONSBREV_TIL_TRYGDERETTEN,
  deprecatedSections: [],
});
