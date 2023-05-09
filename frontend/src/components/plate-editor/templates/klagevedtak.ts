import { deepFreeze } from '@app/functions/deep-freeze';
import { DocumentType } from '@app/types/documents/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { ISmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { TemplateSections } from '@app/types/texts/texts';
import { VERSION } from '../../rich-text/version';
import {
  // createCurrentDate,
  // createFooter,
  // createHeader,
  // createLabelContent,
  createMaltekst,
  createRedigerbarMaltekst,
  // createRegelverk,
  // createSignature,
} from './helpers';

const INITIAL_SLATE_VALUE = [
  // createCurrentDate(),
  // createHeader(),
  createMaltekst(TemplateSections.TITLE),
  // createLabelContent('sakenGjelder.name', 'Klager'),
  // createLabelContent('sakenGjelder.fnr', 'Fødselsnummer'),
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
  createRedigerbarMaltekst(TemplateSections.ANKEINFO),
  createMaltekst(TemplateSections.SAKSKOSTNADER),
  createMaltekst(TemplateSections.GENERELL_INFO),
  // createSignature(),
  // createFooter(),
  // createRegelverk(),
];

export const KLAGEVEDTAK_TEMPLATE = deepFreeze<ISmartEditorTemplate>({
  templateId: TemplateIdEnum.KLAGEVEDTAK,
  type: SaksTypeEnum.KLAGE,
  tittel: 'Vedtak/beslutning',
  content: INITIAL_SLATE_VALUE,
  version: VERSION,
  dokumentTypeId: DocumentType.VEDTAKSBREV,
});
