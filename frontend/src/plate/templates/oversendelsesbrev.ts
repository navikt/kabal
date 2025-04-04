import { deepFreeze } from '@app/functions/deep-freeze';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createMaltekstseksjon,
  createPageBreak,
  createRegelverk,
  createSaksinfo,
  createSignature,
} from '@app/plate/templates/helpers';
import { DistribusjonsType } from '@app/types/documents/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import type { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { DeprecatedTemplateSections, TemplateSections } from '../template-sections';

export const OVERSENDELSESBREV_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.OVERSENDELSESBREV,
  type: SaksTypeEnum.ANKE,
  tittel: 'Tilsvarsbrev med oversendelsesbrev',
  richText: [
    createCurrentDate(),
    createHeader(),

    createMaltekstseksjon(TemplateSections.TILSVARSBREV_TITLE),
    createSaksinfo(),
    createMaltekstseksjon(TemplateSections.TILSVARSRETT_V3),
    createMaltekstseksjon(TemplateSections.GENERELL_INFO),

    createSignature(),

    createPageBreak(),

    createCurrentDate(),

    createMaltekstseksjon(TemplateSections.TITLE),
    createSaksinfo(),
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
