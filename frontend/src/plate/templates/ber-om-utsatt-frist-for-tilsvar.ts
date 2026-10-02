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

export const BER_OM_UTSATT_FRIST_FOR_TILSVAR_SECTIONS: TemplateSections[] = [TemplateSections.TITLE];

export const BER_OM_UTSATT_FRIST_FOR_TILSVAR_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.BER_OM_UTSATT_FRIST_FOR_TILSVAR,
  tittel: 'Ber om utsatt frist for tilsvar',
  dokumentTypeId: DistribusjonsType.EKSPEDISJONSBREV_TIL_TRYGDERETTEN,
  deprecatedSections: [],
};

export const getBerOmUtsattFristForTilsvarTemplate = (params: CreateTemplateParams): ISmartEditorTemplate => {
  const richText: Value = [
    createSaksinfo(params),
    ...BER_OM_UTSATT_FRIST_FOR_TILSVAR_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(),
  ];

  return deepFreeze<IMutableSmartEditorTemplate>({
    ...BER_OM_UTSATT_FRIST_FOR_TILSVAR_METADATA,
    richText,
  });
};
