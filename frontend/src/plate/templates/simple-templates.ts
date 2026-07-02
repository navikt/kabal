import { deepFreeze } from '@/functions/deep-freeze';
import { TemplateSections } from '@/plate/template-sections';
import {
  type CreateTemplateParams,
  createCurrentDate,
  createLabelContent,
  createMaltekstseksjon,
  createPageBreak,
  createSaksinfo,
  createSaksnummer,
  createSignature,
  createSimpleParagraph,
  type TemplateMetadata,
} from '@/plate/templates/helpers';
import { LabelContentSource } from '@/plate/types';
import { DistribusjonsType } from '@/types/documents/documents';
import type { IMutableSmartEditorTemplate, ISmartEditorTemplate } from '@/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

interface GetSaksbehandlerTemplateParams extends CreateTemplateParams {
  overriddenSaksbehandler?: string;
}

export const GENERELT_BREV_SECTIONS: TemplateSections[] = [TemplateSections.TITLE];

export const GENERELT_BREV_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.GENERELT_BREV,
  tittel: 'Generelt brev',
  dokumentTypeId: DistribusjonsType.BREV,
  deprecatedSections: [],
};

export const getGenereltBrevTemplate = ({
  sakstype,
  fagsystemId,
  overriddenSaksbehandler,
}: GetSaksbehandlerTemplateParams): ISmartEditorTemplate =>
  deepFreeze<IMutableSmartEditorTemplate>({
    ...GENERELT_BREV_METADATA,
    richText: [
      createSaksinfo({ sakstype, fagsystemId }),
      ...GENERELT_BREV_SECTIONS.map((section) => createMaltekstseksjon(section)),
      createSimpleParagraph(),
      createSignature(false, overriddenSaksbehandler),
    ],
  });

// Notat has no maltekstseksjon of its own — it's just a free-text paragraph.
export const NOTAT_SECTIONS: TemplateSections[] = [];

export const NOTAT_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.NOTAT,
  tittel: 'Notat',
  dokumentTypeId: DistribusjonsType.NOTAT,
  deprecatedSections: [],
};

export const getNotatTemplate = ({
  sakstype,
  fagsystemId,
  overriddenSaksbehandler,
}: GetSaksbehandlerTemplateParams): ISmartEditorTemplate =>
  deepFreeze<IMutableSmartEditorTemplate>({
    ...NOTAT_METADATA,
    richText: [
      createSaksinfo({ sakstype, fagsystemId }),
      createSimpleParagraph(),
      createSignature(false, overriddenSaksbehandler),
    ],
  });

export const ROL_QUESTIONS_SECTIONS: TemplateSections[] = [
  TemplateSections.TITLE,
  TemplateSections.INTRODUCTION_V2,
  TemplateSections.FREMLEGG,
];

export const ROL_QUESTIONS_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.ROL_QUESTIONS,
  tittel: 'Spørsmål til rådgivende overlege',
  dokumentTypeId: DistribusjonsType.NOTAT,
  deprecatedSections: [],
};

export const getRolQuestionsTemplate = ({ sakstype, fagsystemId }: CreateTemplateParams): ISmartEditorTemplate =>
  deepFreeze<IMutableSmartEditorTemplate>({
    ...ROL_QUESTIONS_METADATA,
    richText: [
      createSaksinfo({
        sakstype,
        fagsystemId,
        children: [
          createLabelContent(LabelContentSource.SAKEN_GJELDER_NAME),
          createLabelContent(LabelContentSource.SAKEN_GJELDER_FNR),
          createLabelContent(LabelContentSource.YTELSE),
          createSaksnummer(),
        ],
      }),

      ...ROL_QUESTIONS_SECTIONS.map((section) => createMaltekstseksjon(section)),
      createSignature(false),
    ],
  });

export const ROL_ANSWERS_SECTIONS: TemplateSections[] = [TemplateSections.TITLE, TemplateSections.SVAR_FRA_ROL];

export const ROL_ANSWERS_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.ROL_ANSWERS,
  tittel: 'Svar fra rådgivende overlege',
  dokumentTypeId: DistribusjonsType.NOTAT,
  deprecatedSections: [],
};

export const ROL_ANSWERS_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  ...ROL_ANSWERS_METADATA,
  richText: [
    createCurrentDate(),
    ...ROL_ANSWERS_SECTIONS.map((section) => createMaltekstseksjon(section)),
    createSignature(),
  ],
});

export const ROL_TILSVARSBREV_SECTIONS: TemplateSections[] = [
  TemplateSections.TITLE,
  TemplateSections.TILSVARSRETT_V3,
  TemplateSections.GENERELL_INFO,
];

// Rendered after a page break, so it's kept separate from ROL_TILSVARSBREV_SECTIONS above.
export const ROL_TILSVARSBREV_VEDLEGG_SECTIONS: TemplateSections[] = [TemplateSections.VEDLEGG];

export const ROL_TILSVARSBREV_METADATA: TemplateMetadata = {
  templateId: TemplateIdEnum.ROL_TILSVARSBREV,
  tittel: 'Tilsvarsbrev (ROL)',
  dokumentTypeId: DistribusjonsType.BREV,
  deprecatedSections: [],
};

export const getRolTilsvarsbrevTemplate = ({ sakstype, fagsystemId }: CreateTemplateParams): ISmartEditorTemplate =>
  deepFreeze<IMutableSmartEditorTemplate>({
    ...ROL_TILSVARSBREV_METADATA,
    richText: [
      createSaksinfo({ sakstype, fagsystemId }),
      ...ROL_TILSVARSBREV_SECTIONS.map((section) => createMaltekstseksjon(section)),
      createPageBreak(),
      ...ROL_TILSVARSBREV_VEDLEGG_SECTIONS.map((section) => createMaltekstseksjon(section)),
    ],
  });
