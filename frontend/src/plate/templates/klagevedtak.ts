import { deepFreeze } from '@app/functions/deep-freeze';
import { EditorValue, TemplateSections } from '@app/plate/types';
import { DistribusjonsType } from '@app/types/documents/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createLabelContent,
  createMaltekst,
  createRedigerbarMaltekst,
  createRegelverk,
  createSignature,
} from './helpers';

const INITIAL_SLATE_VALUE: EditorValue = [
  createCurrentDate(),
  createHeader(),
  createMaltekst(TemplateSections.TITLE),
  createLabelContent('sakenGjelder.name', 'Klager'),
  createLabelContent('sakenGjelder.fnr', 'Fødselsnummer'),
  createRedigerbarMaltekst(TemplateSections.INTRODUCTION),
  createMaltekst(TemplateSections.AVGJOERELSE),
  createRedigerbarMaltekst(TemplateSections.AVGJOERELSE),
  createRedigerbarMaltekst(TemplateSections.KLAGER_VEKTLAGT),
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
  tittel: 'Vedtak/beslutning',
  content: INITIAL_SLATE_VALUE,
  dokumentTypeId: DistribusjonsType.VEDTAKSBREV,
});
