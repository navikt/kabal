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

export const GJENOPPTAKSBEGJÆRING_VEDTAK_SECTIONS: TemplateSections[] = [
  TemplateSections.TITLE,
  TemplateSections.INTRODUCTION_V2,
  TemplateSections.AVGJOERELSE,
  TemplateSections.VURDERINGEN,
  TemplateSections.ANKEINFO,
  TemplateSections.SAKSKOSTNADER,
  TemplateSections.GENERELL_INFO,
];

export const GJENOPPTAKSBEGJÆRING_VEDTAK_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.GJENOPPTAKSBEGJÆRING_VEDTAK,
  tittel: 'Vedtak/beslutning (gjenopptaksbegjæring)',
  dokumentTypeId: DistribusjonsType.VEDTAKSBREV,
  deprecatedSections: [],
};

export const getGjenopptaksbegjæringVedtakTemplate = ({
  sakstype,
  fagsystemId,
}: CreateTemplateParams): ISmartEditorTemplate => {
  const richText: Value = [
    createSaksinfo({ sakstype, fagsystemId }),
    ...GJENOPPTAKSBEGJÆRING_VEDTAK_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(),

    createRegelverk(),
  ];

  return deepFreeze<IMutableSmartEditorTemplate>({
    ...GJENOPPTAKSBEGJÆRING_VEDTAK_METADATA,
    richText,
  });
};
