import type { Value } from 'platejs';
import { deepFreeze } from '@/functions/deep-freeze';
import { DeprecatedTemplateSections, TemplateSections } from '@/plate/template-sections';
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

  createMaltekstseksjon(TemplateSections.TILSVARSBREV_TITLE),

  ...createSaksinfo(),

  createMaltekstseksjon(TemplateSections.TILSVARSRETT_V3),

  createSignature(false),
  createFooter(),
];

export const ORIENTERING_OM_TILSVAR_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ORIENTERING_OM_TILSVAR,
  tittel: 'Orientering om tilsvar direkte til Trygderetten',
  richText: INITIAL_SLATE_VALUE,
  dokumentTypeId: DistribusjonsType.BREV,
  deprecatedSections: [DeprecatedTemplateSections.TILSVARSRETT_V2],
});
