import { Descendant } from 'slate';
import { deepFreeze } from '../../../functions/deep-freeze';
import { OppgaveType } from '../../../types/kodeverk';
import { ISmartEditorTemplate } from '../../../types/smart-editor/smart-editor';
import { TemplateIdEnum } from '../../../types/smart-editor/template-enums';
import { ContentTypeEnum, TextAlignEnum, UndeletableVoidElementsEnum } from '../../rich-text/types/editor-enums';
import { VERSION } from '../../rich-text/version';
import {
  createHeadingOne,
  createHeadingTwo,
  createLabelContent,
  createSignature,
  createSimpleBulletList,
  createSimpleParagraph,
} from './helpers';

export const INITIAL_SLATE_VALUE: Descendant[] = [
  { type: UndeletableVoidElementsEnum.CURRENT_DATE, children: [{ text: '' }] },
  createHeadingOne('NAV Klageinstans har behandlet klagen din'),
  createLabelContent('sakenGjelder.name', 'Klager'),
  createLabelContent('sakenGjelder.fnr', 'Fødselsnummer'),
  createSimpleParagraph('Prosessfullmektig: '),
  createSimpleParagraph('Saken gjelder: Klagen din av [] på NAV []s vedtak av '),
  createSimpleParagraph('Problemstilling: Om'),
  createHeadingTwo('Vedtak'),
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [{ text: '[Alt 1 stadfestelse]\n', bold: true }, { text: 'Vi er enige i vedtaket.' }],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [{ text: '[Alt 2 omgjøring]\n', bold: true }, { text: 'Vi har omgjort vedtaket, slik at' }],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      { text: '[Alt 3 avvisning]\n', bold: true },
      { text: 'Vi har avvist klagen din fordi du ikke har overholdt klagefristen.' },
    ],
  },
  createHeadingTwo('Beslutning'),
  createSimpleParagraph('Vi har opphevet vedtaket og sendt saken tilbake til NAV [], som skal behandle den på nytt.'),
  createHeadingTwo('I klagen din har du lagt vekt på'),
  createSimpleBulletList('osv.'),
  createHeadingTwo('I vurderingen vår har vi lagt vekt på disse dokumentene'),
  createSimpleBulletList('osv.'),
  createHeadingTwo('Vurderingen vår'),
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [{ text: 'For å ha rett til [' }, { text: 'stønad', italic: true }, { text: '], må du' }],
  },
  createHeadingTwo('Konklusjonen vår'),
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      { text: '[Vedtak]', bold: true },
      { text: 'Vi har kommet fram til at du [' },
      { text: 'ikke', italic: true },
      { text: '] har rett til [], og gir deg derfor [' },
      { text: 'ikke medhold><medhold', italic: true },
      { text: '] i klagen din.' },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      { text: 'Vedtaket er gjort etter folketrygdloven § [' },
      { text: 'hjemmel', italic: true },
      { text: '].' },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      { text: '[Beslutning]', bold: true },
      { text: ' Vi kan ikke vurdere om du har rett til [' },
      { text: 'stønad', italic: true },
      { text: '], fordi . NAV [' },
      { text: 'enhet', italic: true },
      { text: '] skal behandle saken på nytt.' },
    ],
  },
  createSimpleParagraph('Saken er vurdert etter folketrygdloven §.'),
  createHeadingTwo('Du har rett til å anke'),
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Hvis du mener dette vedtaket er feil, kan du anke til Trygderetten innen seks uker fra den datoen vedtaket kom fram til deg. Du finner informasjon, skjema og første side for innsending på ',
      },
      { text: 'www.nav.no/klage', underline: true },
      { text: '. Velg NAV Klageinstans [' },
      { text: 'avdeling', italic: true },
      { text: '].' },
    ],
  },
  createSimpleParagraph('Anken må være underskrevet av deg.'),
  createSimpleParagraph(
    'I trygdesaker må du først anke til Trygderetten før du kan ta saken videre til lagmannsretten.'
  ),
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      { text: '[', italic: true },
      { text: 'Husk', bold: true, italic: true },
      { italic: true, text: ': Ta ut avsnittet om anke ved beslutning om oppheving og erstatt med]' },
      {
        text: '\nDenne avgjørelsen er ikke et vedtak som gjelder individuelle rettigheter eller plikter (enkeltvedtak), men en prosessuell beslutning. Du kan ikke klage eller anke over denne beslutningen, jf. forvaltningsloven §§ 2 og 28 og lov om anke til trygderetten § 2.\n',
      },
      { text: '[', italic: true },
      { text: 'Husk', bold: true, italic: true },
      {
        text: ': dersom avgjørelsen delvis er et enkeltvedtak (stadfestelse/ omgjøring) og delvis en beslutning (opphevelse), kan parten påanke den delen av avgjørelsen som er et enkeltvedtak. Avsnittet om ankeadgang må da stå.]',
        italic: true,
      },
    ],
  },
  createHeadingTwo('Du har rett til innsyn'),
  createSimpleParagraph('Du har rett til å se dokumentene i saken din.'),
  createHeadingTwo('Informasjon om fri rettshjelp'),
  createSimpleParagraph('Dette får du vite mer om hos Statsforvalteren eller advokat.'),
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [{ text: '[Dette avsnittet skal bare være med ved omgjøring eller delvis omgjøring]', bold: true }],
  },
  createHeadingTwo('Informasjon om dekning av sakskostnader'),
  createSimpleParagraph(
    `Dersom vi har gjort om vedtaket til din fordel kan du ha rett til å få dekket vesentlige kostnader som har vært nødvendige for å få endret vedtaket.`
  ),
  createSimpleParagraph(
    'Dette må du søke om innen tre uker fra den datoen dette vedtaket er kommet fram til deg. Når du søker om å få dekket utgifter til juridisk bistand, må du legge ved spesifisert timeliste og faktura. Søknaden sender du til NAV Klageinstans Sakskostnader, postboks 22, 4661 Kristiansand.'
  ),
  createHeadingTwo('Har du spørsmål?'),
  createSimpleParagraph(
    'Du finner mer informasjon på nav.no. Hvis du ikke finner svar på spørsmålet ditt, kontakt oss på nav.no/kontakt.'
  ),
  createSimpleParagraph(`Med vennlig hilsen\nNAV Klageinstans`),
  createSignature(),
];

export const KLAGEVEDTAK_LEGACY_TEMPLATE = deepFreeze<ISmartEditorTemplate>({
  templateId: TemplateIdEnum.KLAGEVEDTAK_LEGACY,
  type: OppgaveType.KLAGE,
  tittel: 'Klagevedtak',
  content: INITIAL_SLATE_VALUE,
  version: VERSION,
});
