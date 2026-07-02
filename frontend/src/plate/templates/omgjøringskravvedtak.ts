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

export const OMGJØRINGSKRAVVEDTAK_SECTIONS: TemplateSections[] = [
  TemplateSections.TITLE,

  TemplateSections.INTRODUCTION_V2,
  TemplateSections.AVGJOERELSE,
  TemplateSections.ANFOERSLER,
  TemplateSections.OPPLYSNINGER,
  TemplateSections.SAKSGANG,
  TemplateSections.VURDERINGEN,
  TemplateSections.ANKEINFO,
  TemplateSections.SAKSKOSTNADER,
  TemplateSections.GENERELL_INFO,
];

export const OMGJØRINGSKRAVVEDTAK_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.OMGJØRINGSKRAVVEDTAK,
  tittel: 'Vedtak/beslutning (omgjøringskrav)',
  dokumentTypeId: DistribusjonsType.VEDTAKSBREV,
  deprecatedSections: [],
};

export const getOmgjøringskravvedtakTemplate = ({
  sakstype,
  fagsystemId,
}: CreateTemplateParams): ISmartEditorTemplate => {
  const richText: Value = [
    createSaksinfo({ sakstype, fagsystemId }),

    ...OMGJØRINGSKRAVVEDTAK_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(),

    createRegelverk(),
  ];

  return deepFreeze<IMutableSmartEditorTemplate>({
    ...OMGJØRINGSKRAVVEDTAK_METADATA,
    richText,
  });
};
