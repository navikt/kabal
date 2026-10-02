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

export const UTTALELSE_TIL_TR_GB_SECTIONS: TemplateSections[] = [
  TemplateSections.TITLE,
  TemplateSections.INTRODUCTION_V2,
  TemplateSections.INNLEDNING,
  TemplateSections.ANKEMOTPARTEND_VURDERING,
];

export const UTTALELSE_TIL_TR_GB_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.UTTALELSE_TIL_TR_GB,
  tittel: 'Uttalelse til Trygderetten (begjæring om gjenopptak)',
  dokumentTypeId: DistribusjonsType.BREV,
  deprecatedSections: [],
};

export const getUttalelseTilTrGbTemplate = (params: CreateTemplateParams): ISmartEditorTemplate => {
  const richText: Value = [
    createSaksinfo(params),
    ...UTTALELSE_TIL_TR_GB_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(),
  ];

  return deepFreeze<IMutableSmartEditorTemplate>({
    ...UTTALELSE_TIL_TR_GB_METADATA,
    richText,
  });
};
