import { deepFreeze } from '@app/functions/deep-freeze';
import { DistribusjonsType } from '@app/types/documents/documents';
import type { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import type { Value } from 'platejs';
import { TemplateSections } from '../template-sections';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createMaltekstseksjon,
  createSaksinfo,
  createSignature,
} from './helpers';

const INITIAL_SLATE_VALUE: Value = [
  createCurrentDate(),
  createHeader(),

  createMaltekstseksjon(TemplateSections.TITLE),
  ...createSaksinfo(),
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
  deprecatedSections: [],
});
