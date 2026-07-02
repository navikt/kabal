import type { Value } from 'platejs';
import { deepFreeze } from '@/functions/deep-freeze';
import { TemplateSections } from '@/plate/template-sections';
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

export const GJENOPPTAKSBEGJÆRING_TILSVARSBREV_SECTIONS: TemplateSections[] = [
  TemplateSections.TILSVARSBREV_TITLE,
  TemplateSections.TILSVARSRETT_V3,
  TemplateSections.GENERELL_INFO,
];

// Rendered before the second `createSaksinfo()` below, unlike the other section list in this template.
export const GJENOPPTAKSBEGJÆRING_OVERSENDELSESBREV_TITLE_SECTIONS: TemplateSections[] = [TemplateSections.TITLE];

export const GJENOPPTAKSBEGJÆRING_OVERSENDELSESBREV_SECTIONS: TemplateSections[] = [
  TemplateSections.INTRODUCTION_V2,
  TemplateSections.ANFOERSLER,
  TemplateSections.OPPLYSNINGER,
  TemplateSections.VURDERINGEN,
];

export const GJENOPPTAKSBEGJÆRING_TILSVARSBREV_MED_OVERSENDELSESBREV_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.GJENOPPTAKSBEGJÆRING_TILSVARSBREV_MED_OVERSENDELSESBREV,
  tittel: 'Tilsvarsbrev med oversendelsesbrev (gjenopptaksbegjæring)',
  dokumentTypeId: DistribusjonsType.BREV,
  deprecatedSections: [],
};

export const getGjenopptaksbegjæringTilsvarsbrevMedOversendelsesbrevTemplate = ({
  sakstype,
  fagsystemId,
}: CreateTemplateParams): ISmartEditorTemplate => {
  const richText: Value = [
    createSaksinfo({ sakstype, fagsystemId }),
    ...GJENOPPTAKSBEGJÆRING_TILSVARSBREV_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(),

    createPageBreak(),

    ...GJENOPPTAKSBEGJÆRING_OVERSENDELSESBREV_TITLE_SECTIONS.map((section) => createMaltekstseksjon(section)),
    createSaksinfo({ sakstype, fagsystemId }),
    ...GJENOPPTAKSBEGJÆRING_OVERSENDELSESBREV_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(),

    createRegelverk(),
  ];

  return deepFreeze<IMutableSmartEditorTemplate>({
    ...GJENOPPTAKSBEGJÆRING_TILSVARSBREV_MED_OVERSENDELSESBREV_METADATA,
    richText,
  });
};
