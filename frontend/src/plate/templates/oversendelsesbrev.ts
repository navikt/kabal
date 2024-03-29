import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { deepFreeze } from '@app/functions/deep-freeze';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createLabelContent,
  createMaltekstseksjon,
  createPageBreak,
  createParagraphWithLabelContent,
  createRegelverk,
  createSignature,
} from '@app/plate/templates/helpers';
import { TextAlign } from '@app/plate/types';
import { DistribusjonsType } from '@app/types/documents/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { TemplateSections } from '../template-sections';

export const OVERSENDELSESBREV_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.OVERSENDELSESBREV,
  type: SaksTypeEnum.ANKE,
  tittel: 'Tilsvarsbrev med oversendelsesbrev',
  content: [
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
      ],
    },

    createParagraphWithLabelContent('saksnummer', 'Saksnummer'),
    createMaltekstseksjon(TemplateSections.TILSVARSRETT),
    createMaltekstseksjon(TemplateSections.GENERELL_INFO),

    createSignature(), // TODO: Make it possible to only show saksbehandler signature here

    createPageBreak(),

    createMaltekstseksjon(TemplateSections.TITLE),

    createParagraphWithLabelContent('sakenGjelder.name', 'Den ankende part'),
    createParagraphWithLabelContent('sakenGjelder.fnr', 'Fødselsnummer'),
    createParagraphWithLabelContent('saksnummer', 'Saksnummer'),

    createMaltekstseksjon(TemplateSections.INTRODUCTION),
    createMaltekstseksjon(TemplateSections.ANFOERSLER),
    createMaltekstseksjon(TemplateSections.OPPLYSNINGER),
    createMaltekstseksjon(TemplateSections.VURDERINGEN),

    createSignature(),
    createFooter(),
    createRegelverk(),
  ],
  dokumentTypeId: DistribusjonsType.BREV,
});
