import { deepFreeze } from '@/functions/deep-freeze';
import { TemplateSections } from '@/plate/template-sections';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createMaltekstseksjon,
  createPageBreak,
  createRegelverk,
  createSaksinfo,
  createSignature,
} from '@/plate/templates/helpers';
import { DistribusjonsType } from '@/types/documents/documents';
import type { IMutableSmartEditorTemplate } from '@/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

export const GJENOPPTAKSBEGJÆRING_TILSVARSBREV_MED_OVERSENDELSESBREV_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>(
  {
    templateId: TemplateIdEnum.GJENOPPTAKSBEGJÆRING_TILSVARSBREV_MED_OVERSENDELSESBREV,
    tittel: 'Tilsvarsbrev med oversendelsesbrev (gjenopptaksbegjæring)',
    richText: [
      createCurrentDate(),
      createHeader(),

      createMaltekstseksjon(TemplateSections.TILSVARSBREV_TITLE),
      ...createSaksinfo(),
      createMaltekstseksjon(TemplateSections.TILSVARSRETT_V3),
      createMaltekstseksjon(TemplateSections.GENERELL_INFO),

      createSignature(),

      createPageBreak(),

      createCurrentDate(),

      createMaltekstseksjon(TemplateSections.TITLE),
      ...createSaksinfo(),
      createMaltekstseksjon(TemplateSections.INTRODUCTION_V2),
      createMaltekstseksjon(TemplateSections.ANFOERSLER),
      createMaltekstseksjon(TemplateSections.OPPLYSNINGER),
      createMaltekstseksjon(TemplateSections.VURDERINGEN),

      createSignature(),
      createFooter(),
      createRegelverk(),
    ],
    dokumentTypeId: DistribusjonsType.BREV,
    deprecatedSections: [],
  },
);
