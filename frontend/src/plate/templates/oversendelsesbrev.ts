import type { Value } from 'platejs';
import { deepFreeze } from '@/functions/deep-freeze';
import { DeprecatedTemplateSections, TemplateSections } from '@/plate/template-sections';
import {
  type CreateTemplateParams,
  createMaltekstseksjon,
  createPageBreak,
  createRegelverk,
  createSaksinfo,
  createSignature,
  type TemplateMetadata,
} from '@/plate/templates/helpers';
import { DistribusjonsType } from '@/types/documents/documents';
import type { IMutableSmartEditorTemplate, ISmartEditorTemplate } from '@/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

export const OVERSENDELSESBREV_TILSVARSBREV_SECTIONS: TemplateSections[] = [
  TemplateSections.TILSVARSBREV_TITLE,
  TemplateSections.TILSVARSRETT_V3,
  TemplateSections.GENERELL_INFO,
];

export const OVERSENDELSESBREV_VEDTAK_SECTIONS: TemplateSections[] = [
  TemplateSections.TITLE,
  TemplateSections.INTRODUCTION_V2,
  TemplateSections.ANFOERSLER,
  TemplateSections.OPPLYSNINGER,
  TemplateSections.VURDERINGEN,
];

export const OVERSENDELSESBREV_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.OVERSENDELSESBREV,
  tittel: 'Tilsvarsbrev med oversendelsesbrev',
  dokumentTypeId: DistribusjonsType.BREV,
  deprecatedSections: [DeprecatedTemplateSections.TILSVARSRETT_V2],
};

export const getOversendelsesbrevTemplate = ({ sakstype, fagsystemId }: CreateTemplateParams): ISmartEditorTemplate => {
  const richText: Value = [
    createSaksinfo({ sakstype, fagsystemId }),
    ...OVERSENDELSESBREV_TILSVARSBREV_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(),

    createPageBreak(),
    createSaksinfo({ sakstype, fagsystemId }),
    ...OVERSENDELSESBREV_VEDTAK_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(),

    createRegelverk(),
  ];

  return deepFreeze<IMutableSmartEditorTemplate>({
    ...OVERSENDELSESBREV_METADATA,
    richText,
  });
};
