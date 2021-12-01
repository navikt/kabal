import { Descendant } from 'slate';
import { ISignatureContent, ISmartEditorTemplate } from '../../../redux-api/smart-editor-types';
import { ContentTypeEnum, HeadingTypesEnum, ListTypesEnum, TextAlignEnum } from '../editor-types';

const INITIAL_SLATE_VALUE: Descendant[] = [
  {
    type: HeadingTypesEnum.HEADING_ONE,
    children: [
      {
        text: 'NAV Klageinstans har behandlet klagen din',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Klager: ',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Fødselsnummer: ',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Saken gjelder: ',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Problemstilling: ',
      },
    ],
  },
  {
    type: HeadingTypesEnum.HEADING_TWO,
    children: [
      {
        text: 'Vedtak',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Vi har omgjort vedtaket, slik at ...',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: HeadingTypesEnum.HEADING_TWO,
    children: [
      {
        text: 'I klagen din har du lagt vekt på: ',
      },
    ],
  },
  {
    type: ListTypesEnum.BULLET_LIST,
    children: [
      {
        type: ListTypesEnum.LIST_ITEM,
        children: [
          {
            text: 'Dette er fullstendig fritekst uten forhåndsutfylling',
          },
        ],
      },
      {
        type: ListTypesEnum.LIST_ITEM,
        children: [
          {
            text: '',
          },
        ],
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: HeadingTypesEnum.HEADING_TWO,
    children: [
      {
        text: 'I vurderingen vår har vi lagt vekt på disse dokumentene: ',
      },
    ],
  },
  {
    type: ListTypesEnum.BULLET_LIST,
    children: [
      {
        type: ListTypesEnum.LIST_ITEM,
        children: [
          {
            text: 'Klagen din ',
          },
        ],
      },
      {
        type: ListTypesEnum.LIST_ITEM,
        children: [
          {
            text: 'Inntektsmelding ',
          },
        ],
      },
      {
        type: ListTypesEnum.LIST_ITEM,
        children: [
          {
            text: 'Sykemelding',
          },
        ],
      },
      {
        type: ListTypesEnum.LIST_ITEM,
        children: [
          {
            text: 'Referat fra dialogmøte',
          },
        ],
      },
      {
        type: ListTypesEnum.LIST_ITEM,
        children: [
          {
            text: '',
          },
        ],
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: HeadingTypesEnum.HEADING_TWO,
    children: [
      {
        text: 'Vurderingen vår',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Dette er fritekst.',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Forslag til standardtekst kommer inn her.',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: HeadingTypesEnum.HEADING_TWO,
    children: [
      {
        text: 'Konklusjonen vår',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Vi har kommet fram til at du ikke har rett til sykepenger, og gir deg derfor ikke medhold i klagen din.',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Vedtaket er gjort etter folketrygdloven § 8-3.',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: HeadingTypesEnum.HEADING_TWO,
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: HeadingTypesEnum.HEADING_TWO,
    children: [
      {
        text: 'Du har rett til å anke ',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Hvis du mener dette vedtaket er feil, kan du anke til Trygderetten innen seks uker fra den datoen vedtaket kom fram til deg. Du finner informasjon, skjema og første side for innsending på ',
      },
      {
        text: 'www.nav.no/klage',
        underline: true,
      },
      {
        text: '. Velg NAV Klageinstans Nord ',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Anken må være underskrevet av deg.',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'I trygdesaker må du først anke til Trygderetten før du kan ta saken videre til lagmannsretten. ',
      },
    ],
  },
  {
    type: HeadingTypesEnum.HEADING_TWO,
    children: [
      {
        text: 'Du har rett til innsyn ',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Du har rett til å se dokumentene i saken din. ',
      },
    ],
  },
  {
    type: HeadingTypesEnum.HEADING_TWO,
    children: [
      {
        text: 'Informasjon om fri rettshjelp',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Dette får du vite mer om hos fylkesmannen eller advokat.',
      },
    ],
  },
  {
    type: HeadingTypesEnum.HEADING_TWO,
    children: [
      {
        text: 'Har du spørsmål? ',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Kontakt oss gjerne på nav.no eller på telefon 21 07 17 30. Hvis du oppgir fødselsnummeret ditt når du tar kontakt med NAV kan vi lettere gi deg rask og god hjelp.',
      },
    ],
  },
];

const INITIAL_SIGNATURE_VALUE: ISignatureContent = {
  medunderskriver: {
    name: '',
    title: '',
  },
  saksbehandler: {
    name: '',
    title: '',
  },
};

export const UTFALL_TEMPLATE: ISmartEditorTemplate = {
  templateId: 'utfall',
  title: 'Vedtaksbrev utfall',
  content: [
    {
      id: 'klager',
      label: 'Klager',
      type: 'text',
      content: '',
    },
    {
      id: 'date',
      label: 'Dato',
      type: 'date',
      content: '',
    },
    {
      id: 'test-smart-editor',
      label: '',
      type: 'rich-text',
      content: INITIAL_SLATE_VALUE,
    },
    {
      id: 'greeting',
      label: '',
      type: 'static-text',
      content: ['Med vennlig hilsen', 'NAV Klageinstans'],
    },
    {
      id: 'signature',
      label: 'Signatur',
      type: 'signature',
      content: INITIAL_SIGNATURE_VALUE,
    },
  ],
};
