import type { Value } from 'platejs';
import { deepFreeze } from '@/functions/deep-freeze';
import { TemplateSections } from '@/plate/template-sections';
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

export const TILSVAR_TIL_TRYGDERETTEN_SECTIONS: TemplateSections[] = [
  TemplateSections.TITLE,
  TemplateSections.INTRODUCTION_V2,
  TemplateSections.INNLEDNING,
  TemplateSections.SAKENS_FAKTISKE_SIDE,
  TemplateSections.SAKENS_RETTSLIGE_SIDE,
];

export const TILSVAR_TIL_TRYGDERETTEN_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.TILSVAR_TIL_TRYGDERETTEN,
  tittel: 'Tilsvar til Trygderetten',
  dokumentTypeId: DistribusjonsType.BREV,
  deprecatedSections: [],
};

export const getTilsvarTilTrygderettenTemplate = (params: CreateTemplateParams): ISmartEditorTemplate => {
  const richText: Value = [
    createSaksinfo(params),
    ...TILSVAR_TIL_TRYGDERETTEN_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(),
  ];

  return deepFreeze<IMutableSmartEditorTemplate>({
    ...TILSVAR_TIL_TRYGDERETTEN_METADATA,
    richText,
  });
};
