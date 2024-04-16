import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { deepFreeze } from '@app/functions/deep-freeze';
import { EditorValue, TextAlign } from '@app/plate/types';
import { DistribusjonsType } from '@app/types/documents/documents';
import { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Language } from '@app/types/texts/common';
import { TemplateSections } from '../template-sections';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createLabelContent,
  createMaltekstseksjon,
  createSignature,
} from './helpers';

const INITIAL_SLATE_VALUE: EditorValue = [
  createCurrentDate(),
  createHeader(),

  createMaltekstseksjon(TemplateSections.TILSVARSBREV_TITLE),

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

  createMaltekstseksjon(TemplateSections.TILSVARSRETT),

  createSignature(),
  createFooter(),
];

export const ORIENTERING_OM_TILSVAR_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ORIENTERING_OM_TILSVAR,
  tittel: 'Orientering om tilsvar direkte til Trygderetten',
  content: INITIAL_SLATE_VALUE,
  dokumentTypeId: DistribusjonsType.BREV,
  language: Language.NB,
});
