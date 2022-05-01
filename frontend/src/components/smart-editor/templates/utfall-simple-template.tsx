import { Descendant } from 'slate';
import { deepFreeze } from '../../../functions/deep-freeze';
import { ISmartEditorTemplate } from '../../../types/smart-editor';
import {
  ContentTypeEnum,
  HeadingTypesEnum,
  ListContentEnum,
  ListTypesEnum,
  TextAlignEnum,
  VoidElementsEnum,
} from '../editor-types';

/* eslint-disable max-lines */
export const INITIAL_SLATE_VALUE: Descendant[] = [
  {
    type: VoidElementsEnum.CURRENT_DATE,
    children: [{ text: '' }],
  },
  {
    type: VoidElementsEnum.MALTEKST,
    children: [{ text: '' }],
    source: 'document-title',
    maltekst: null,
    threadIds: [],
  },
  {
    type: VoidElementsEnum.LABEL_CONTENT,
    children: [{ text: '' }],
    source: 'sakenGjelder.name',
    label: 'Klager',
    threadIds: [],
  },
  {
    type: VoidElementsEnum.LABEL_CONTENT,
    children: [{ text: '' }],
    source: 'sakenGjelder.fnr',
    label: 'Fødselsnummer',
    threadIds: [],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [{ text: 'Prosessfullmektig: ' }],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [{ text: 'Saken gjelder: Klagen din av [] på NAV []s vedtak av ' }],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [{ text: 'Problemstilling: Om' }],
  },
  { type: HeadingTypesEnum.HEADING_ONE, children: [{ text: 'Vedtak' }] },
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
  { type: HeadingTypesEnum.HEADING_ONE, children: [{ text: 'Beslutning' }] },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [{ text: 'Vi har opphevet vedtaket og sendt saken tilbake til NAV [], som skal behandle den på nytt.' }],
  },
  { type: HeadingTypesEnum.HEADING_ONE, children: [{ text: 'I klagen din har du lagt vekt på' }] },
  {
    type: ListTypesEnum.BULLET_LIST,
    children: [
      {
        type: ListContentEnum.LIST_ITEM,
        children: [{ type: ListContentEnum.LIST_ITEM_CONTAINER, children: [{ text: 'osv.' }] }],
      },
    ],
  },
  {
    type: HeadingTypesEnum.HEADING_ONE,
    children: [{ text: 'I vurderingen vår har vi lagt vekt på disse dokumentene' }],
  },
  {
    type: VoidElementsEnum.DOCUMENT_LIST,
    children: [{ text: '' }],
    threadIds: [],
    documents: [],
  },
  { type: HeadingTypesEnum.HEADING_ONE, children: [{ text: 'Vurderingen vår' }] },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [{ text: 'For å ha rett til [' }, { text: 'stønad', italic: true }, { text: '], må du' }],
  },
  { type: HeadingTypesEnum.HEADING_ONE, children: [{ text: 'Konklusjonen vår' }] },
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
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [{ text: 'Saken er vurdert etter folketrygdloven §.' }],
  },
  { type: HeadingTypesEnum.HEADING_ONE, children: [{ text: 'Du har rett til å anke' }] },
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
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [{ text: 'Anken må være underskrevet av deg.' }],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      { text: 'I trygdesaker må du først anke til Trygderetten før du kan ta saken videre til lagmannsretten.' },
    ],
  },
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
  { type: HeadingTypesEnum.HEADING_ONE, children: [{ text: 'Du har rett til innsyn' }] },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [{ text: 'Du har rett til å se dokumentene i saken din.' }],
  },
  { type: HeadingTypesEnum.HEADING_ONE, children: [{ text: 'Informasjon om fri rettshjelp' }] },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [{ text: 'Dette får du vite mer om hos Statsforvalteren eller advokat.' }],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [{ text: '[Dette avsnittet skal bare være med ved omgjøring eller delvis omgjøring]', bold: true }],
  },
  { type: HeadingTypesEnum.HEADING_ONE, children: [{ text: 'Informasjon om dekning av sakskostnader' }] },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Dersom vi har gjort om vedtaket til din fordel kan du ha rett til å få dekket vesentlige kostnader som har vært nødvendige for å få endret vedtaket.',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Dette må du søke om innen tre uker fra den datoen dette vedtaket er kommet fram til deg. Når du søker om å få dekket utgifter til juridisk bistand, må du legge ved spesifisert timeliste og faktura. Søknaden sender du til NAV Klageinstans Sakskostnader, Postboks 644, Lundsiden, 4606 Kristiansand.',
      },
    ],
  },
  {
    type: VoidElementsEnum.MALTEKST,
    source: 'questions',
    children: [{ text: '' }],
    maltekst: null,
    threadIds: [],
  },
  {
    type: VoidElementsEnum.MALTEKST,
    source: 'regards',
    children: [{ text: '' }],
    maltekst: null,
    threadIds: [],
  },
  {
    type: VoidElementsEnum.SIGNATURE,
    useShortName: false,
    children: [{ text: '' }],
    threadIds: [],
  },
];

export const UTFALL_SIMPLE_TEMPLATE = deepFreeze<ISmartEditorTemplate>({
  templateId: 'utfall-simple',
  tittel: 'Klagevedtak',
  children: INITIAL_SLATE_VALUE,
});
