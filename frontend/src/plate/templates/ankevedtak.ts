import { deepFreeze } from '@app/functions/deep-freeze';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createMaltekst,
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

export const ANKEVEDTAK_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ANKEVEDTAK,
  type: SaksTypeEnum.ANKE,
  tittel: 'Vedtak/beslutning (anke)',
  content: [
    createCurrentDate(),
    createHeader(),
    createMaltekst(TemplateSections.TITLE),
    createParagraphWithLabelContent('sakenGjelder.name', 'Den ankende part'),
    createParagraphWithLabelContent('sakenGjelder.fnr', 'Fødselsnummer'),
    createParagraphWithLabelContent('saksnummer', 'Saksnummer'),
    createRedigerbarMaltekst(TemplateSections.INTRODUCTION),
    createMaltekst(TemplateSections.BESLUTNING),
    createRedigerbarMaltekst(TemplateSections.BESLUTNING),
    createMaltekst(TemplateSections.VEDTAK),
    createRedigerbarMaltekst(TemplateSections.VEDTAK),
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
