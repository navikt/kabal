import { format } from 'date-fns';
import { ISO_DATETIME_FORMAT } from '@app/components/date-picker/constants';
import { TextAlign } from '@app/plate/types';
import { IS_LOCALHOST } from '@app/redux-api/common';
import { TextsTagTypes, textsApi } from '@app/redux-api/texts/texts';
import { PlainTextTypes, RichTextTypes } from '@app/types/common-text-types';
import { Language } from '@app/types/texts/language';
import { IGetTextsParams } from '@app/types/texts/params';
import {
  DraftPlainTextContent,
  DraftRichTextContent,
  DraftRichTextVersion,
  IText,
  PlainTextVersion,
  PublishedPlainTextContent,
  PublishedRichTextContent,
  RichTextVersion,
  SearchableTextItem,
} from '@app/types/texts/responses';
import { ListTagTypes } from '../tag-types';

const textsListTags = (texts: (IText | SearchableTextItem)[] | undefined) =>
  typeof texts === 'undefined'
    ? [{ type: TextsTagTypes.TEXT, id: ListTagTypes.PARTIAL_LIST }]
    : texts
        .map(({ id }) => ({ type: TextsTagTypes.TEXT, id }))
        .concat({ type: TextsTagTypes.TEXT, id: ListTagTypes.PARTIAL_LIST });

export const textsQuerySlice = textsApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getTexts: builder.query<IText[], IGetTextsParams>({
      query: (params) => ({ url: '/texts', params }),
      providesTags: textsListTags,
    }),
    getTextList: builder.query<SearchableTextItem[], IGetTextsParams>({
      query: (params) => ({ url: '/texts/searchable', params, validateStatus: () => true }),
      providesTags: textsListTags,
      transformResponse: () => {
        const response: SearchableTextItem[] = [];

        for (let i = 0; i < 20; i++) {
          response.push({
            id: i.toString(10),
            created: format(new Date(), ISO_DATETIME_FORMAT),
            modified: format(new Date(), ISO_DATETIME_FORMAT),
            publishedDateTime: format(new Date(), ISO_DATETIME_FORMAT),
            title: `Title ${i}`,
            textType: RichTextTypes.MALTEKST,
            plainText: null,
            richText: {
              nb: [{ type: 'p', align: TextAlign.LEFT, children: [{ text: `Rich text ${i}` }] }],
              nn: [{ type: 'p', align: TextAlign.LEFT, children: [{ text: `Rich text ${i}` }] }],
            },
          });
        }

        return response;
      },
    }),
    getTextById: builder.query<IText, string>({
      query: (id) => ({ url: `/texts/${id}`, validateStatus: () => true }),
      providesTags: (_, __, id) => [{ type: TextsTagTypes.TEXT, id }],
      transformResponse: (_, __, id) => ({
        id,
        created: format(new Date(), ISO_DATETIME_FORMAT),
        modified: format(new Date(), ISO_DATETIME_FORMAT),
        publishedDateTime: format(new Date(), ISO_DATETIME_FORMAT),
        published: true,
        publishedBy: '',
        editors: [],
        versionId: '1',
        title: `Title ${id}`,
        textType: RichTextTypes.MALTEKST,
        plainText: null,
        richText: {
          nb: ['nb-01'],
          nn: ['nn-01'],
        },
        draftMaltekstseksjonIdList: [],
        publishedMaltekstseksjonIdList: [],
        templateSectionIdList: [],
        ytelseHjemmelIdList: [],
        utfallIdList: [],
        enhetIdList: [],
      }),
    }),
    getTextVersions: builder.query<(RichTextVersion | PlainTextVersion)[], { id: string; language: Language }>({
      query: ({ id, language }) => ({ url: `/texts/${id}/${language}/versions`, validateStatus: () => true }),
      providesTags: (_, __, { id, language }) => [{ type: TextsTagTypes.TEXT_VERSIONS, id: `${id}-${language}` }],
      transformResponse: (_, __, { id, language }) => {
        const draft: DraftRichTextVersion = {
          id: `${id}-${language}-draft`,
          publishedDateTime: null,
          published: false,
          publishedBy: null,
          modified: format(new Date(), ISO_DATETIME_FORMAT),
          created: format(new Date(), ISO_DATETIME_FORMAT),
          editors: [],
          versionId: 'DRAFT',
          draftMaltekstseksjonIdList: [],
          publishedMaltekstseksjonIdList: [],
          templateSectionIdList: [],
          ytelseHjemmelIdList: [],
          utfallIdList: [],
          enhetIdList: [],
          title: 'Title',
          textType: RichTextTypes.MALTEKST,
          richText: [
            {
              type: 'p',
              align: TextAlign.LEFT,
              children: [{ text: `Text ID: ${id}\nLanguage: ${language}\nVersion ID: DRAFT` }],
            },
          ],
        };

        const response: (RichTextVersion | PlainTextVersion)[] = [draft];

        for (let i = 3; i >= 0; i--) {
          response.push({
            id: `${id}-${language}-${i}`,
            publishedDateTime: format(new Date(), ISO_DATETIME_FORMAT),
            modified: format(new Date(), ISO_DATETIME_FORMAT),
            created: format(new Date(), ISO_DATETIME_FORMAT),
            published: i === 3,
            publishedBy: 'Name of publisher',
            editors: [],
            versionId: i.toString(10),
            draftMaltekstseksjonIdList: [],
            publishedMaltekstseksjonIdList: [],
            templateSectionIdList: [],
            ytelseHjemmelIdList: [],
            utfallIdList: [],
            enhetIdList: [],
            title: 'Title',
            textType: RichTextTypes.MALTEKST,
            richText: [
              {
                type: 'p',
                align: TextAlign.LEFT,
                children: [{ text: `Text ID: ${id}\nLanguage: ${language}\nVersion ID: ${i}` }],
              },
            ],
          });
        }

        return response;
      },
    }),
    getRichText: builder.query<PublishedRichTextContent | DraftRichTextContent, string>({
      query: (id) => ({ url: `/texts/richtext/${id}`, validateStatus: () => true }),
      transformResponse: () => ({
        id: '1',
        created: format(new Date(), ISO_DATETIME_FORMAT),
        modified: format(new Date(), ISO_DATETIME_FORMAT),
        publishedDateTime: format(new Date(), ISO_DATETIME_FORMAT),
        published: true,
        publishedBy: '',
        editors: [],
        versionId: '1',
        draftMaltekstseksjonIdList: [],
        publishedMaltekstseksjonIdList: [],
        templateSectionIdList: [],
        ytelseHjemmelIdList: [],
        utfallIdList: [],
        enhetIdList: [],
        title: 'Title',
        textType: RichTextTypes.MALTEKST,
        plainText: null,
        richText: [{ type: 'p', align: TextAlign.LEFT, children: [{ text: `Rich text 1` }] }],
      }),
    }),
    getPlainText: builder.query<PublishedPlainTextContent | DraftPlainTextContent, string>({
      query: (id) => ({ url: `/texts/plaintext/${id}`, validateStatus: () => true }),
      transformResponse: () => ({
        id: '1',
        created: format(new Date(), ISO_DATETIME_FORMAT),
        modified: format(new Date(), ISO_DATETIME_FORMAT),
        publishedDateTime: format(new Date(), ISO_DATETIME_FORMAT),
        published: true,
        publishedBy: '',
        editors: [],
        versionId: '1',
        draftMaltekstseksjonIdList: [],
        publishedMaltekstseksjonIdList: [],
        templateSectionIdList: [],
        ytelseHjemmelIdList: [],
        utfallIdList: [],
        enhetIdList: [],
        title: 'Title',
        textType: PlainTextTypes.HEADER,
        plainText: 'Plain text',
        richText: null,
      }),
    }),
  }),
});

export const {
  useGetTextByIdQuery,
  useGetTextVersionsQuery,
  useGetTextsQuery,
  useLazyGetTextByIdQuery,
  useGetTextListQuery,
  useGetRichTextQuery,
  useGetPlainTextQuery,
} = textsQuerySlice;
