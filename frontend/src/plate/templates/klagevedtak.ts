import { deepFreeze } from '@app/functions/deep-freeze';
import { EditorValue } from '@app/plate/types';
import { DistribusjonsType } from '@app/types/documents/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { TemplateSections } from '../template-sections';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createMaltekst,
  createParagraphWithLabelContent,
  createRedigerbarMaltekst,
  createRegelverk,
  createSignature,
} from './helpers';

const INITIAL_SLATE_VALUE: EditorValue = [
  createCurrentDate(),
  createHeader(),
  createMaltekst(TemplateSections.TITLE),
  createParagraphWithLabelContent('sakenGjelder.name', 'Klager'),
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
];

export const KLAGEVEDTAK_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.KLAGEVEDTAK,
  type: SaksTypeEnum.KLAGE,
  tittel: 'Vedtak/beslutning (klage)',
  content: INITIAL_SLATE_VALUE,
  dokumentTypeId: DistribusjonsType.VEDTAKSBREV,
});
