import { deepFreeze } from '@app/functions/deep-freeze';
import { LabelContentSource } from '@app/plate/types';
import { DistribusjonsType } from '@app/types/documents/documents';
import type { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import type { Value } from 'platejs';
import { TemplateSections } from '../template-sections';
import {
  createCurrentDate,
  createFooter,
  createFullmektig,
  createHeader,
  createLabelContent,
  createMaltekstseksjon,
  createSaksnummer,
  createSignature,
} from './helpers';

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
