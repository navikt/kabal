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

export const GJENOPPTAKSBEGJÆRING_ORIENTERING_OM_TILSVAR_SECTIONS: TemplateSections[] = [
  TemplateSections.TILSVARSBREV_TITLE,
  TemplateSections.TILSVARSRETT_V3,
];

export const GJENOPPTAKSBEGJÆRING_ORIENTERING_OM_TILSVAR_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.GJENOPPTAKSBEGJÆRING_ORIENTERING_OM_TILSVAR_DIREKTE_TIL_TR,
  tittel: 'Orientering om tilsvar direkte til Trygderetten (gjenopptaksbegjæring)',
  dokumentTypeId: DistribusjonsType.BREV,
  deprecatedSections: [],
};

export const getGjenopptaksbegjæringOrienteringOmTilsvarTemplate = ({
  sakstype,
  fagsystemId,
}: CreateTemplateParams): ISmartEditorTemplate => {
  const richText: Value = [
    createSaksinfo({ sakstype, fagsystemId }),
    ...GJENOPPTAKSBEGJÆRING_ORIENTERING_OM_TILSVAR_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(false),
  ];

  return deepFreeze<IMutableSmartEditorTemplate>({
    ...GJENOPPTAKSBEGJÆRING_ORIENTERING_OM_TILSVAR_METADATA,
    richText,
  });
};
