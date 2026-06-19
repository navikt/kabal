import type { Value } from 'platejs';
import { deepFreeze } from '@/functions/deep-freeze';
import { TemplateSections } from '@/plate/template-sections';
import { createMaltekstseksjon, createRegelverk, createSaksinfo, createSignature } from '@/plate/templates/helpers';
import { DistribusjonsType } from '@/types/documents/documents';
import type { IMutableSmartEditorTemplate } from '@/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

const INITIAL_SLATE_VALUE: Value = [
  createSaksinfo(),

  createMaltekstseksjon(TemplateSections.TITLE),

  createMaltekstseksjon(TemplateSections.INTRODUCTION_V2),
  createMaltekstseksjon(TemplateSections.AVGJOERELSE),
  createMaltekstseksjon(TemplateSections.ANFOERSLER),
  createMaltekstseksjon(TemplateSections.OPPLYSNINGER),
  createMaltekstseksjon(TemplateSections.SAKSGANG),
  createMaltekstseksjon(TemplateSections.VURDERINGEN),
  createMaltekstseksjon(TemplateSections.ANKEINFO),
  createMaltekstseksjon(TemplateSections.SAKSKOSTNADER),
  createMaltekstseksjon(TemplateSections.GENERELL_INFO),

  createSignature(),

  createRegelverk(),
];

export const OMGJØRINGSKRAVVEDTAK_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.OMGJØRINGSKRAVVEDTAK,
  tittel: 'Vedtak/beslutning (omgjøringskrav)',
  richText: INITIAL_SLATE_VALUE,
  dokumentTypeId: DistribusjonsType.VEDTAKSBREV,
  deprecatedSections: [],
});
