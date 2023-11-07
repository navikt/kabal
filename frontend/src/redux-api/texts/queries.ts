import { IS_LOCALHOST } from '@app/redux-api/common';
import { TextsTagTypes, textsApi } from '@app/redux-api/texts/texts';
import { IGetTextsParams } from '@app/types/texts/params';
import { IText } from '@app/types/texts/responses';
import { ListTagTypes } from '../tag-types';

const textsListTags = (texts: IText[] | undefined) =>
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
    getTextById: builder.query<IText, string>({
      query: (id) => `/texts/${id}`,
      providesTags: (_, __, id) => [{ type: TextsTagTypes.TEXT, id }],
    }),
    getTextVersions: builder.query<IText[], string>({
      query: (id) => `/texts/${id}/versions`,
      providesTags: (_, __, id) => [{ type: TextsTagTypes.TEXT_VERSIONS, id }],
    }),
  }),
});

export const { useGetTextByIdQuery, useGetTextVersionsQuery, useGetTextsQuery, useLazyGetTextByIdQuery } =
  textsQuerySlice;
