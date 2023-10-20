import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { deepFreeze } from '@app/functions/deep-freeze';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createLabelContent,
  createMaltekst,
  createRedigerbarMaltekst,
  createRegelverk,
  createSignature,
} from '@app/plate/templates/helpers';
import { TextAlign } from '@app/plate/types';
import { DistribusjonsType } from '@app/types/documents/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { TemplateSections } from '../template-sections';

export const ANKEVEDTAK_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ANKEVEDTAK,
  type: SaksTypeEnum.ANKE,
  tittel: 'Vedtak/beslutning (anke)',
  content: [
    createCurrentDate(),
    createHeader(),
    createMaltekst(TemplateSections.TITLE),
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
    createRedigerbarMaltekst(TemplateSections.INTRODUCTION),
    createMaltekst(TemplateSections.AVGJOERELSE),
    createRedigerbarMaltekst(TemplateSections.AVGJOERELSE),
    createRedigerbarMaltekst(TemplateSections.ANFOERSLER),
    createRedigerbarMaltekst(TemplateSections.OPPLYSNINGER),
    createMaltekst(TemplateSections.VURDERINGEN),
    createRedigerbarMaltekst(TemplateSections.VURDERINGEN),
    createMaltekst(TemplateSections.KONKLUSJON),
    createRedigerbarMaltekst(TemplateSections.KONKLUSJON),
    createMaltekst(TemplateSections.ANKEINFO),
    createMaltekst(TemplateSections.SAKSKOSTNADER),
    createMaltekst(TemplateSections.GENERELL_INFO),
    createSignature(),
    createFooter(),
    createRegelverk(),
  ],
  dokumentTypeId: DistribusjonsType.VEDTAKSBREV,
});
