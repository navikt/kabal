import { Descendant } from 'slate';
import { deepFreeze } from '../../../functions/deep-freeze';
import { ISmartEditorTemplate } from '../../../types/smart-editor';
import { ContentTypeEnum, HeadingTypesEnum, TextAlignEnum } from '../editor-types';

/* eslint-disable max-lines */
const EMPTY_SLATE_VALUE: Descendant[] = [
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [{ text: '' }],
  },
];

export const UTFALL_TEMPLATE = deepFreeze<ISmartEditorTemplate>({
  templateId: 'utfall',
  tittel: 'Vedtak-/utfallsbrev',
  content: [
    {
      type: 'document-title',
      id: 'document-title',
      content: 'NAV Klageinstans har behandlet klagen din',
    },
    {
      type: 'section',
      id: 'data-section',
      content: [
        {
          type: 'label-content',
          id: 'klager',
          label: 'Klager',
          source: 'sakenGjelder.name',
          content: undefined,
        },
        {
          type: 'label-content',
          id: 'fnr',
          label: 'Fødselsnummer',
          source: 'sakenGjelder.fnr',
          content: undefined,
        },
      ],
    },
    {
      type: 'section',
      id: 'section-vedtak',
      content: [
        {
          type: 'section-title',
          id: 'vedtak-title',
          source: 'utfall-title',
          content: undefined,
        },
        {
          id: 'vedtak',
          type: 'rich-text',
          content: [
            {
              type: ContentTypeEnum.PARAGRAPH,
              textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
              children: [{ text: '[Alt 1 stadfestelse] Vi er enige i vedtaket.' }],
            },
            {
              type: ContentTypeEnum.PARAGRAPH,
              textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
              children: [{ text: '[Alt 2 omgjøring] Vi har omgjort vedtaket, slik at' }],
            },
            {
              type: ContentTypeEnum.PARAGRAPH,
              textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
              children: [
                { text: '[Alt 3 avvisning] Vi har avvist klagen din fordi du ikke har overholdt klagefristen.' },
              ],
            },
            {
              type: ContentTypeEnum.PARAGRAPH,
              textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
              children: [
                {
                  text: '[Beslutning] Vi har opphevet vedtaket og sendt saken tilbake til NAV, som skal behandle den på nytt.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      id: 'section-din-vekt',
      content: [
        {
          type: 'section-title',
          id: 'din-vekt-title',
          content: 'I klagen din har du lagt vekt på',
        },
        {
          id: 'din-vekt',
          type: 'rich-text',
          content: EMPTY_SLATE_VALUE,
        },
      ],
    },
    {
      type: 'section',
      id: 'section-documents',
      content: [
        {
          type: 'section-title',
          id: 'documents-title',
          content: 'I vurderingen vår har vi lagt vekt på disse dokumentene',
        },
        {
          type: 'document-list',
          id: 'document-list',
          content: [],
        },
      ],
    },
    {
      type: 'section',
      id: 'section-vurdering',
      content: [
        {
          type: 'section-title',
          id: 'vurdering-title',
          content: 'Vurderingen vår',
        },
        {
          id: 'vurdering',
          type: 'rich-text',
          content: EMPTY_SLATE_VALUE,
        },
      ],
    },
    {
      type: 'section',
      id: 'section-konklusjon',
      content: [
        {
          type: 'section-title',
          id: 'konklusjon-title',
          content: 'Konklusjonen vår',
        },
        {
          id: 'konklusjon',
          type: 'rich-text',
          content: [
            {
              type: ContentTypeEnum.PARAGRAPH,
              textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
              children: [
                {
                  text: '[Vedtak]Vi har kommet fram til at du [ikke] har rett til, og gir deg derfor [ikke medhold><medhold] i klagen din.',
                },
              ],
            },
            {
              type: ContentTypeEnum.PARAGRAPH,
              textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
              children: [{ text: 'Vedtaket er gjort etter folketrygdloven § [hjemmel].' }],
            },
            {
              type: ContentTypeEnum.PARAGRAPH,
              textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
              children: [
                {
                  text: '[Beslutning] Vi kan ikke vurdere om du har rett til [stønad], fordi . NAV [enhet] skal behandle saken på nytt.',
                },
              ],
            },
            {
              type: ContentTypeEnum.PARAGRAPH,
              textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
              children: [{ text: 'Saken er vurdert etter folketrygdloven §.' }],
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      id: 'section-anke',
      content: [
        {
          type: 'rich-text',
          id: 'anke-text',
          content: [
            {
              type: HeadingTypesEnum.HEADING_ONE,
              children: [{ text: 'Du har rett til å anke' }],
            },
            {
              type: ContentTypeEnum.PARAGRAPH,
              textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
              children: [
                {
                  text: 'Hvis du mener dette vedtaket er feil, kan du anke til Trygderetten innen seks uker fra den datoen vedtaket kom fram til deg. Du finner informasjon, skjema og første side for innsending på www.nav.no/klage. Velg NAV Klageinstans [avdeling].',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      id: 'section-questions',
      content: [
        {
          type: 'static',
          id: 'questions',
          source: 'questions',
          content: undefined,
        },
      ],
    },
    {
      type: 'section',
      id: 'section-regards',
      content: [
        {
          type: 'static',
          id: 'regards',
          source: 'regards',
          content: undefined,
        },
      ],
    },
    {
      type: 'signature',
      id: 'signature',
      content: { useShortName: false },
    },
  ],
});
