import { Descendant } from 'slate';
import { ISmartEditorTemplate } from '../../../types/smart-editor';
import { ContentTypeEnum, HeadingTypesEnum, ListTypesEnum, TextAlignEnum } from '../editor-types';

const INITIAL_SLATE_VALUE: Descendant[] = [
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Kari Nordmann',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_RIGHT,
    children: [
      {
        text: 'dd. måned ååå',
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
        text: 'Klager:',
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
        text: 'Vi er enige i vedtaket.',
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
        text: 'Forslag til standardtekst kommer inn her. ',
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
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Med vennlig hilsen',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'NAV Klageinstans ',
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
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Ola Nordmann',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Rådgiver',
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
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Kari Nordmann',
      },
    ],
  },
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: 'Rådgiver/saksbehandler',
      },
    ],
  },
];

export const AVSLAG_TEMPLATE: ISmartEditorTemplate = {
  templateId: 'avslag',
  title: 'Vedtaksbrev avslag',
  content: [
    {
      id: 'test-smart-editor',
      label: '',
      type: 'rich-text',
      content: INITIAL_SLATE_VALUE,
    },
  ],
};
