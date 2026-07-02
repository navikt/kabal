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

export const TIL_FORELEGGELSE_SECTIONS: TemplateSections[] = [
  TemplateSections.TITLE,

  TemplateSections.TILSVARSRETT_V3,
  TemplateSections.GENERELL_INFO,
];

export const TIL_FORELEGGELSE_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.TIL_FORELEGGELSE,
  tittel: 'Til foreleggelse',
  dokumentTypeId: DistribusjonsType.BREV,
  deprecatedSections: [],
};

export const getTilForeleggelseTemplate = ({ sakstype, fagsystemId }: CreateTemplateParams): ISmartEditorTemplate => {
  const richText: Value = [
    createSaksinfo({ sakstype, fagsystemId }),
    ...TIL_FORELEGGELSE_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(false),
  ];

  return deepFreeze<IMutableSmartEditorTemplate>({
    ...TIL_FORELEGGELSE_METADATA,
    richText,
  });
};
