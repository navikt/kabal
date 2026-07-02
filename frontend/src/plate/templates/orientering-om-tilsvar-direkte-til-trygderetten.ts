import type { Value } from 'platejs';
import { deepFreeze } from '@/functions/deep-freeze';
import { DeprecatedTemplateSections, TemplateSections } from '@/plate/template-sections';
import {
  type CreateTemplateParams,
  createMaltekstseksjon,
  createSaksinfo,
  createSignature,
  type TemplateMetadata,
} from '@/plate/templates/helpers';
import { DistribusjonsType } from '@/types/documents/documents';
import type { IMutableSmartEditorTemplate, ISmartEditorTemplate } from '@/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

export const ORIENTERING_OM_TILSVAR_SECTIONS: TemplateSections[] = [
  TemplateSections.TILSVARSBREV_TITLE,
  TemplateSections.TILSVARSRETT_V3,
];

export const ORIENTERING_OM_TILSVAR_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.ORIENTERING_OM_TILSVAR,
  tittel: 'Orientering om tilsvar direkte til Trygderetten',
  dokumentTypeId: DistribusjonsType.BREV,
  deprecatedSections: [DeprecatedTemplateSections.TILSVARSRETT_V2],
};

export const getOrienteringOmTilsvarTemplate = ({
  sakstype,
  fagsystemId,
}: CreateTemplateParams): ISmartEditorTemplate => {
  const richText: Value = [
    createSaksinfo({ sakstype, fagsystemId }),
    ...ORIENTERING_OM_TILSVAR_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(false),
  ];

  return deepFreeze<IMutableSmartEditorTemplate>({
    ...ORIENTERING_OM_TILSVAR_METADATA,
    richText,
  });
};
