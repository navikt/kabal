import { Descendant } from 'slate';
import { deepFreeze } from '../../../functions/deep-freeze';
import { OppgaveType } from '../../../types/kodeverk';
import { ISmartEditorTemplate } from '../../../types/smart-editor/smart-editor';
import { TemplateIdEnum } from '../../../types/smart-editor/template-enums';
import { TemplateSections } from '../../../types/texts/texts';
import { VERSION } from '../../rich-text/version';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createLabelContent,
  createMaltekst,
  createPageBreak,
  createRedigerbarMaltekst,
  createRegelverktekst,
  createSignature,
} from './helpers';

export const INITIAL_SLATE_VALUE: Descendant[] = [
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
  createRedigerbarMaltekst(TemplateSections.ANKEINFO),
  createMaltekst(TemplateSections.SAKSKOSTNADER),
  createMaltekst(TemplateSections.GENERELL_INFO),
  createSignature(),
  createFooter(),
  createPageBreak(),
  createMaltekst(TemplateSections.REGELVERK),
  createRegelverktekst(TemplateSections.REGELVERK),
];

export const KLAGEVEDTAK_TEMPLATE = deepFreeze<ISmartEditorTemplate>({
  templateId: TemplateIdEnum.KLAGEVEDTAK,
  type: OppgaveType.KLAGE,
  tittel: 'Klagevedtak (test)',
  content: INITIAL_SLATE_VALUE,
  version: VERSION,
});
