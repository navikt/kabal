import { deepFreeze } from '@app/functions/deep-freeze';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createMaltekst,
  createPageBreak,
  createParagraphWithLabelContent,
  createRedigerbarMaltekst,
  createRegelverk,
  createSignature,
} from '@app/plate/templates/helpers';
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
    createMaltekst(TemplateSections.TILSVARSBREV_TITLE),
    createParagraphWithLabelContent('sakenGjelder.name', 'Den ankende part'),
    createParagraphWithLabelContent('sakenGjelder.fnr', 'Fødselsnummer'),
    createParagraphWithLabelContent('saksnummer', 'Saksnummer'),
    createMaltekst(TemplateSections.TILSVARSRETT),
    createMaltekst(TemplateSections.GENERELL_INFO),
    createSignature(), // TODO: Make it possible to only show saksbehandler signature here

    createPageBreak(),

    createMaltekst(TemplateSections.TITLE),
    createParagraphWithLabelContent('sakenGjelder.name', 'Den ankende part'),
    createParagraphWithLabelContent('sakenGjelder.fnr', 'Fødselsnummer'),
    createParagraphWithLabelContent('saksnummer', 'Saksnummer'),
    createRedigerbarMaltekst(TemplateSections.INTRODUCTION),
    createMaltekst(TemplateSections.AVGJOERELSE),
    createRedigerbarMaltekst(TemplateSections.AVGJOERELSE),
    createRedigerbarMaltekst(TemplateSections.ANFOERSLER),
    createRedigerbarMaltekst(TemplateSections.OPPLYSNINGER),
    createMaltekst(TemplateSections.VURDERINGEN),
    createRedigerbarMaltekst(TemplateSections.VURDERINGEN),
    createSignature(),
    createFooter(),
    createRegelverk(),
  ],
  dokumentTypeId: DistribusjonsType.BREV,
});
