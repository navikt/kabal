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

export const BESLUTNING_I_SAK_OM_BEGJÆRING_OM_UTSATT_IVERKSETTELSE_SECTIONS: TemplateSections[] = [
  TemplateSections.TITLE,

  TemplateSections.INTRODUCTION_V2,
  TemplateSections.AVGJOERELSE,
  TemplateSections.VURDERINGEN,
  TemplateSections.ANKEINFO,
  TemplateSections.GENERELL_INFO,
];

export const BESLUTNING_I_SAK_OM_BEGJÆRING_OM_UTSATT_IVERKSETTELSE_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.BESLUTNING_I_SAK_OM_BEGJÆRING_OM_UTSATT_IVERKSETTELSE,
  tittel: 'Beslutning i sak om begjæring om utsatt iverksettelse',
  dokumentTypeId: DistribusjonsType.BESLUTNING,
  deprecatedSections: [],
};

export const getBeslutningISakOmBegjæringOmUtsattIverksettelseTemplate = (
  params: CreateTemplateParams,
): ISmartEditorTemplate => {
  const richText: Value = [
    createSaksinfo(params),
    ...BESLUTNING_I_SAK_OM_BEGJÆRING_OM_UTSATT_IVERKSETTELSE_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(false),

    createRegelverk(),
  ];

  return deepFreeze<IMutableSmartEditorTemplate>({
    ...BESLUTNING_I_SAK_OM_BEGJÆRING_OM_UTSATT_IVERKSETTELSE_METADATA,
    richText,
  });
};
