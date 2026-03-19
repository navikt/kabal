import { deepFreeze } from '@/functions/deep-freeze';
import { DeprecatedTemplateSections, TemplateSections } from '@/plate/template-sections';
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
import { SaksTypeEnum } from '@/types/kodeverk';
import type { IMutableSmartEditorTemplate } from '@/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

export const OVERSENDELSESBREV_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.OVERSENDELSESBREV,
  type: SaksTypeEnum.ANKE,
  tittel: 'Tilsvarsbrev med oversendelsesbrev',
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
  deprecatedSections: [DeprecatedTemplateSections.TILSVARSRETT_V2],
});
