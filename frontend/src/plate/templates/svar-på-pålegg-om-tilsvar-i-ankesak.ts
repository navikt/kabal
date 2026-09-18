import type { Value } from 'platejs';
import { deepFreeze } from '@/functions/deep-freeze';
import { TemplateSections } from '@/plate/template-sections';
import {
  type CreateTemplateParams,
  createMaltekstseksjon,
  createRegelverk,
  createSaksinfo,
  createSignature,
  type TemplateMetadata,
} from '@/plate/templates/helpers';
import { DistribusjonsType } from '@/types/documents/documents';
import type { IMutableSmartEditorTemplate, ISmartEditorTemplate } from '@/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

export const SVAR_PÅ_PÅLEGG_OM_TILSVAR_I_ANKESAK_SECTIONS: TemplateSections[] = [TemplateSections.TITLE];

export const SVAR_PÅ_PÅLEGG_OM_TILSVAR_I_ANKESAK_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.SVAR_PÅ_PÅLEGG_OM_TILSVAR_I_ANKESAK,
  tittel: 'Svar på pålegg om tilsvar i ankesak',
  dokumentTypeId: DistribusjonsType.EKSPEDISJONSBREV_TIL_TRYGDERETTEN,
  deprecatedSections: [],
};

export const getSvarPåPåleggOmTilsvarIAnkesakTemplate = (params: CreateTemplateParams): ISmartEditorTemplate => {
  const richText: Value = [
    createSaksinfo(params),
    ...SVAR_PÅ_PÅLEGG_OM_TILSVAR_I_ANKESAK_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(),
    createRegelverk(),
  ];

  return deepFreeze<IMutableSmartEditorTemplate>({
    ...SVAR_PÅ_PÅLEGG_OM_TILSVAR_I_ANKESAK_METADATA,
    richText,
  });
};
