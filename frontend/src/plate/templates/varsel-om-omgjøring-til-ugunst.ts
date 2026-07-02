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

export const VARSEL_OM_OMGJØRING_TIL_UGUNST_SECTIONS: TemplateSections[] = [
  TemplateSections.TITLE,
  TemplateSections.INTRODUCTION_V2,
  TemplateSections.HVORFOR_OMGJØRING,
  TemplateSections.OM_REGELVERK,
  TemplateSections.TILSVARSRETT_V3,
  TemplateSections.GENERELL_INFO,
];

export const VARSEL_OM_OMGJØRING_TIL_UGUNST_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.VARSEL_OM_OMGJØRING_TIL_UGUNST_TEMPLATE,
  tittel: 'Varsel om omgjøring til ugunst',
  dokumentTypeId: DistribusjonsType.BREV,
  deprecatedSections: [],
};

export const getVarselOmOmgjøringTilUgunstTemplate = ({
  sakstype,
  fagsystemId,
}: CreateTemplateParams): ISmartEditorTemplate => {
  const richText: Value = [
    createSaksinfo({ sakstype, fagsystemId }),
    ...VARSEL_OM_OMGJØRING_TIL_UGUNST_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(),

    createRegelverk(),
  ];

  return deepFreeze<IMutableSmartEditorTemplate>({
    ...VARSEL_OM_OMGJØRING_TIL_UGUNST_METADATA,
    richText,
  });
};
