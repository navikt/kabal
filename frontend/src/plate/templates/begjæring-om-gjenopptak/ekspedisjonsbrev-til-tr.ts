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

export const GJENOPPTAKSBEGJÆRING_EKSPEDISJONSBREV_TIL_TR_SECTIONS: TemplateSections[] = [
  TemplateSections.TITLE,
  TemplateSections.INTRODUCTION_V2,
  TemplateSections.OM_ANKENDE_PARTS_TILSVAR,
  TemplateSections.OM_VEDLAGTE_DOKUMENTER,
];

export const GJENOPPTAKSBEGJÆRING_EKSPEDISJONSBREV_TIL_TR_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.GJENOPPTAKSBEGJÆRING_EKSPEDISJONSBREV_TIL_TR,
  tittel: 'Ekspedisjonsbrev til Trygderetten (gjenopptaksbegjæring)',
  dokumentTypeId: DistribusjonsType.EKSPEDISJONSBREV_TIL_TRYGDERETTEN,
  deprecatedSections: [],
};

export const getGjenopptaksbegjæringEkspedisjonsbrevTilTrTemplate = ({
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

    ...GJENOPPTAKSBEGJÆRING_EKSPEDISJONSBREV_TIL_TR_SECTIONS.map((section) => createMaltekstseksjon(section)),

    createSignature(false),
  ];

  return deepFreeze<IMutableSmartEditorTemplate>({
    ...GJENOPPTAKSBEGJÆRING_EKSPEDISJONSBREV_TIL_TR_METADATA,
    richText,
  });
};
