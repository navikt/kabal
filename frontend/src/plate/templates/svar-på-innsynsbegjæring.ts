import type { Value } from 'platejs';
import { deepFreeze } from '@/functions/deep-freeze';
import { TemplateSections } from '@/plate/template-sections';
import {
  createCurrentDate,
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
  createCurrentDate(),
  createHeader(),

  createMaltekstseksjon(TemplateSections.TITLE),
  ...createSaksinfo(),
  createMaltekstseksjon(TemplateSections.SVAR_PÅ_INNSYNSBEGJÆRING),
  createMaltekstseksjon(TemplateSections.OM_TAUSHETSPLIKT),

  createSignature(false),
  createFooter(),
];

export const SVAR_PÅ_INNSYNSBEGJÆRING_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.SVAR_PÅ_INNSYNSBEGJÆRING,
  tittel: 'Svar på innsynsbegjæring',
  richText: INITIAL_SLATE_VALUE,
  dokumentTypeId: DistribusjonsType.BREV,
  deprecatedSections: [],
});
