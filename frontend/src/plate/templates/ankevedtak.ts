import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { deepFreeze } from '@app/functions/deep-freeze';
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
  content: [
    createCurrentDate(),
    createHeader(),
    createMaltekstseksjon(TemplateSections.TITLE),
    {
      type: ELEMENT_PARAGRAPH,
      align: TextAlign.LEFT,
      children: [
        createLabelContent('klagerIfEqualToSakenGjelder.name', 'Den ankende part'),
        createLabelContent('sakenGjelderIfDifferentFromKlager.name', 'Saken gjelder'),
        createLabelContent('sakenGjelder.fnr', 'Fødselsnummer'),
        createLabelContent('klagerIfDifferentFromSakenGjelder.name', 'Den ankende part'),
        createLabelContent('saksnummer', 'Saksnummer'),
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
