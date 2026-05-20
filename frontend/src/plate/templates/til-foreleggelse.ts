import type { Value } from 'platejs';
import { deepFreeze } from '@/functions/deep-freeze';
import { TemplateSections } from '@/plate/template-sections';
import {
  createFooter,
  createHeader,
  createMaltekstseksjon,
  createSaksinfo,
  createSignature,
} from '@/plate/templates/helpers';
import { DistribusjonsType } from '@/types/documents/documents';
import type { IMutableSmartEditorTemplate } from '@/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

const INITIAL_SLATE_VALUE: Value = [
  createHeader(),

  createSaksinfo(),
  createMaltekstseksjon(TemplateSections.TITLE),

  createMaltekstseksjon(TemplateSections.TILSVARSRETT_V3),
  createMaltekstseksjon(TemplateSections.GENERELL_INFO),

  createSignature(false),
  createFooter(),
];

export const TIL_FORELEGGELSE_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.TIL_FORELEGGELSE,
  tittel: 'Til foreleggelse',
  richText: INITIAL_SLATE_VALUE,
  dokumentTypeId: DistribusjonsType.BREV,
  deprecatedSections: [],
});
