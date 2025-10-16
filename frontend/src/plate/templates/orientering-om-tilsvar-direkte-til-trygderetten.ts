import { deepFreeze } from '@app/functions/deep-freeze';
import { DistribusjonsType } from '@app/types/documents/documents';
import type { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import type { Value } from 'platejs';
import { DeprecatedTemplateSections, TemplateSections } from '../template-sections';
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

  createMaltekstseksjon(TemplateSections.TILSVARSBREV_TITLE),

  ...createSaksinfo(),

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
