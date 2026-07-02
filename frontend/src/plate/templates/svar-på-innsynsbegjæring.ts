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

export const SVAR_PÅ_INNSYNSBEGJÆRING_SECTIONS: TemplateSections[] = [
  TemplateSections.TITLE,
  TemplateSections.SVAR_PÅ_INNSYNSBEGJÆRING,
  TemplateSections.OM_TAUSHETSPLIKT,
];

export const SVAR_PÅ_INNSYNSBEGJÆRING_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.SVAR_PÅ_INNSYNSBEGJÆRING,
  tittel: 'Svar på innsynsbegjæring',
  dokumentTypeId: DistribusjonsType.BREV,
  deprecatedSections: [],
};

export const getSvarPåInnsynsbegjæringTemplate = ({
  sakstype,
  fagsystemId,
}: CreateTemplateParams): ISmartEditorTemplate => {
  const richText: Value = [
    createSaksinfo({ sakstype, fagsystemId }),
    ...SVAR_PÅ_INNSYNSBEGJÆRING_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(false),
  ];

  return deepFreeze<IMutableSmartEditorTemplate>({
    ...SVAR_PÅ_INNSYNSBEGJÆRING_METADATA,
    richText,
  });
};
