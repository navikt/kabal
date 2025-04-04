import { deepFreeze } from '@app/functions/deep-freeze';
import { TemplateSections } from '@app/plate/template-sections';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createMaltekstseksjon,
  createRegelverk,
  createSaksinfo,
  createSignature,
} from '@app/plate/templates/helpers';
import { DistribusjonsType } from '@app/types/documents/documents';
import type { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import type { Value } from '@udecode/plate';

const INITIAL_SLATE_VALUE: Value = [
  createCurrentDate(),
  createHeader(),

  createMaltekstseksjon(TemplateSections.TITLE),
  createSaksinfo(),
  createMaltekstseksjon(TemplateSections.INTRODUCTION_V2),
  createMaltekstseksjon(TemplateSections.AVGJOERELSE),
  createMaltekstseksjon(TemplateSections.ANFOERSLER),
  createMaltekstseksjon(TemplateSections.OPPLYSNINGER),
  createMaltekstseksjon(TemplateSections.VURDERINGEN),
  createMaltekstseksjon(TemplateSections.ANKEINFO),
  createMaltekstseksjon(TemplateSections.SAKSKOSTNADER),
  createMaltekstseksjon(TemplateSections.GENERELL_INFO),

  createSignature(),
  createFooter(),
  createRegelverk(),
];

export const BEHANDLING_ETTER_TR_OPPHEVET_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.BEHANDLING_ETTER_TR_OPPHEVET_VEDTAK,
  tittel: 'Vedtak/beslutning (ny behandling)',
  richText: INITIAL_SLATE_VALUE,
  dokumentTypeId: DistribusjonsType.VEDTAKSBREV,
  deprecatedSections: [],
});
