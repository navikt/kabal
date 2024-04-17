import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { deepFreeze } from '@app/functions/deep-freeze';
import { EditorValue, TextAlign } from '@app/plate/types';
import { DistribusjonsType } from '@app/types/documents/documents';
import { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Language } from '@app/types/texts/language';
import { TemplateSections } from '../template-sections';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createLabelContent,
  createMaltekstseksjon,
  createRegelverk,
  createSignature,
} from './helpers';

const INITIAL_SLATE_VALUE: EditorValue = [
  createCurrentDate(),
  createHeader(),

  createMaltekstseksjon(TemplateSections.TITLE),

  {
    type: ELEMENT_PARAGRAPH,
    align: TextAlign.LEFT,
    children: [
      createLabelContent('klagerIfEqualToSakenGjelder.name', 'Klager'),
      createLabelContent('sakenGjelderIfDifferentFromKlager.name', 'Saken gjelder'),
      createLabelContent('sakenGjelder.fnr', 'Fødselsnummer'),
      createLabelContent('klagerIfDifferentFromSakenGjelder.name', 'Klager'),
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
];

export const KLAGEVEDTAK_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.KLAGEVEDTAK_V2,
  tittel: 'Vedtak/beslutning (klage)',
  content: INITIAL_SLATE_VALUE,
  dokumentTypeId: DistribusjonsType.VEDTAKSBREV,
  language: Language.NB,
});
