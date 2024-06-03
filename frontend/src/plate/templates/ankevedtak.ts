import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { deepFreeze } from '@app/functions/deep-freeze';
import { Source } from '@app/plate/components/label-content';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createLabelContent,
  createMaltekstseksjon,
  createRegelverk,
  createSignature,
} from '@app/plate/templates/helpers';
import { TextAlign } from '@app/plate/types';
import { DistribusjonsType } from '@app/types/documents/documents';
import { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { TemplateSections } from '../template-sections';

export const ANKEVEDTAK_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ANKEVEDTAK,
  tittel: 'Vedtak/beslutning (anke)',
  richText: [
    createCurrentDate(),
    createHeader(),
    createMaltekstseksjon(TemplateSections.TITLE),
    {
      type: ELEMENT_PARAGRAPH,
      align: TextAlign.LEFT,
      children: [
        createLabelContent(Source.KLAGER_IF_EQUAL_TO_SAKEN_GJELDER_NAME, 'Den ankende part'),
        createLabelContent(Source.SAKEN_GJELDER_IF_DIFFERENT_FROM_KLAGER_NAME, 'Saken gjelder'),
        createLabelContent(Source.SAKEN_GJELDER_FNR, 'Fødselsnummer'),
        createLabelContent(Source.KLAGER_IF_DIFFERENT_FROM_SAKEN_GJELDER_NAME, 'Den ankende part'),
        createLabelContent(Source.SAKSNUMMER, 'Saksnummer'),
      ],
    },
    createMaltekstseksjon(TemplateSections.INTRODUCTION),
    createMaltekstseksjon(TemplateSections.AVGJOERELSE),
    createMaltekstseksjon(TemplateSections.ANFOERSLER),
    createMaltekstseksjon(TemplateSections.OPPLYSNINGER),
    createMaltekstseksjon(TemplateSections.VURDERINGEN),
    createMaltekstseksjon(TemplateSections.KONKLUSJON),
    createMaltekstseksjon(TemplateSections.ANKEINFO),
    createMaltekstseksjon(TemplateSections.SAKSKOSTNADER),
    createMaltekstseksjon(TemplateSections.GENERELL_INFO),
    createSignature(),
    createFooter(),
    createRegelverk(),
  ],
  dokumentTypeId: DistribusjonsType.VEDTAKSBREV,
});
