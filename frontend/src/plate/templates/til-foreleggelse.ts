import { deepFreeze } from '@app/functions/deep-freeze';
import { TemplateSections } from '@app/plate/template-sections';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createMaltekstseksjon,
  createSaksinfo,
  createSignature,
} from '@app/plate/templates/helpers';
import { DistribusjonsType } from '@app/types/documents/documents';
import type { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import type { Value } from 'platejs';

const INITIAL_SLATE_VALUE: Value = [
  createCurrentDate(),
  createHeader(),

  createMaltekstseksjon(TemplateSections.TITLE),

  ...createSaksinfo(),

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
