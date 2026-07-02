import type { Value } from 'platejs';
import { deepFreeze } from '@/functions/deep-freeze';
import { TemplateSections } from '@/plate/template-sections';
import {
  type CreateTemplateParams,
  createFullmektig,
  createLabelContent,
  createMaltekstseksjon,
  createSaksinfo,
  createSaksnummer,
  createSignature,
  type TemplateMetadata,
} from '@/plate/templates/helpers';
import { LabelContentSource } from '@/plate/types';
import { DistribusjonsType } from '@/types/documents/documents';
import type { IMutableSmartEditorTemplate, ISmartEditorTemplate } from '@/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

export const ETTERSENDING_TIL_TRYGDERETTEN_SECTIONS: TemplateSections[] = [
  TemplateSections.TITLE,
  TemplateSections.INTRODUCTION_V2,
  TemplateSections.OM_ETTERSENDING_TIL_TR,
];

export const ETTERSENDING_TIL_TRYGDERETTEN_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.ETTERSENDING_TIL_TRYGDERETTEN,
  tittel: 'Ettersending til Trygderetten',
  dokumentTypeId: DistribusjonsType.EKSPEDISJONSBREV_TIL_TRYGDERETTEN,
  deprecatedSections: [],
};

export const getEttersendingTilTrygderettenTemplate = ({
  sakstype,
  fagsystemId,
}: CreateTemplateParams): ISmartEditorTemplate => {
  const richText: Value = [
    createSaksinfo({
      sakstype,
      fagsystemId,
      children: [
        createLabelContent(LabelContentSource.KLAGER_IF_EQUAL_TO_SAKEN_GJELDER_NAME),
        createLabelContent(LabelContentSource.SAKEN_GJELDER_IF_DIFFERENT_FROM_KLAGER_NAME),
        createLabelContent(LabelContentSource.SAKEN_GJELDER_FNR),
        createLabelContent(LabelContentSource.KLAGER_IF_DIFFERENT_FROM_SAKEN_GJELDER_NAME),
        createFullmektig(),
        createLabelContent(LabelContentSource.ANKEMOTPART),
        createSaksnummer(),
      ],
    }),

    ...ETTERSENDING_TIL_TRYGDERETTEN_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(false),
  ];

  return deepFreeze<IMutableSmartEditorTemplate>({
    ...ETTERSENDING_TIL_TRYGDERETTEN_METADATA,
    richText,
  });
};
