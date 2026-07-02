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

export const ANKEVEDTAK_SECTIONS: TemplateSections[] = [
  TemplateSections.TITLE,
  TemplateSections.INTRODUCTION_V2,
  TemplateSections.AVGJOERELSE,
  TemplateSections.VURDERINGEN,
  TemplateSections.ANKEINFO,
  TemplateSections.SAKSKOSTNADER,
  TemplateSections.GENERELL_INFO,
];

export const ANKEVEDTAK_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.ANKEVEDTAK,
  tittel: 'Vedtak/beslutning (anke)',
  dokumentTypeId: DistribusjonsType.VEDTAKSBREV,
  deprecatedSections: [],
};

export const getAnkevedtakTemplate = ({ sakstype, fagsystemId }: CreateTemplateParams): ISmartEditorTemplate => {
  const richText: Value = [
    createSaksinfo({ sakstype, fagsystemId }),
    ...ANKEVEDTAK_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(),
    createRegelverk(),
  ];

  return deepFreeze<IMutableSmartEditorTemplate>({
    ...ANKEVEDTAK_METADATA,
    richText,
  });
};
