import type { Value } from 'platejs';
import { deepFreeze } from '@/functions/deep-freeze';
import { TemplateSections } from '@/plate/template-sections';
import {
  type CreateTemplateParams,
  createFullmektig,
  createLabelContent,
  createMaltekstseksjon,
  createRegelverk,
  createSaksinfo,
  createSaksnummer,
  createSignature,
  type TemplateMetadata,
} from '@/plate/templates/helpers';
import { LabelContentSource } from '@/plate/types';
import { DistribusjonsType } from '@/types/documents/documents';
import type { IMutableSmartEditorTemplate, ISmartEditorTemplate } from '@/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

export const FORENKLET_BESLUTNING_OM_IKKE_Å_OMGJØRE_SECTIONS: TemplateSections[] = [
  TemplateSections.TITLE,
  TemplateSections.INTRODUCTION_V2,
  TemplateSections.AVGJOERELSE,
  TemplateSections.VURDERINGEN,
  TemplateSections.ANKEINFO,
  TemplateSections.GENERELL_INFO,
];

export const FORENKLET_BESLUTNING_OM_IKKE_Å_OMGJØRE_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.FORENKLET_BESLUTNING_OM_IKKE_Å_OMGJØRE,
  tittel: 'Forenklet beslutning om ikke å omgjøre',
  dokumentTypeId: DistribusjonsType.BESLUTNING,
  deprecatedSections: [],
};

export const getForenkletBeslutningOmIkkeÅOmgjøreTemplate = ({
  sakstype,
  fagsystemId,
}: CreateTemplateParams): ISmartEditorTemplate => {
  const richText: Value = [
    createSaksinfo({
      sakstype,
      fagsystemId,
      children: [
        createLabelContent(LabelContentSource.KLAGER_IF_EQUAL_TO_SAKEN_GJELDER_NAME),
        createLabelContent(LabelContentSource.SAKEN_GJELDER_IF_DIFFERENT_FROM_KLAGER_NAME),
        createLabelContent(LabelContentSource.SAKEN_GJELDER_FNR),
        createLabelContent(LabelContentSource.KLAGER_IF_DIFFERENT_FROM_SAKEN_GJELDER_NAME),
        createFullmektig(),
        createSaksnummer(),
      ],
    }),

    ...FORENKLET_BESLUTNING_OM_IKKE_Å_OMGJØRE_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(),

    createRegelverk(),
  ];

  return deepFreeze<IMutableSmartEditorTemplate>({
    ...FORENKLET_BESLUTNING_OM_IKKE_Å_OMGJØRE_METADATA,
    richText,
  });
};
