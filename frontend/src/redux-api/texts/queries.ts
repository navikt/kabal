import { IS_LOCALHOST } from '@app/redux-api/common';
import { paramsWithGlobalQueries } from '@app/redux-api/redaktør-helpers';
import { TextsTagTypes, textsApi } from '@app/redux-api/texts/texts';
import type { IGetTextsParams } from '@app/types/texts/params';
import type { IText, ListText } from '@app/types/texts/responses';
import { ListTagTypes } from '../tag-types';

const textsListTags = (texts: ListText[] | undefined) =>
  texts === undefined
    ? [{ type: TextsTagTypes.TEXT, id: ListTagTypes.PARTIAL_LIST }]
    : texts
        .map(({ id }) => ({ type: TextsTagTypes.TEXT, id }))
        .concat({ type: TextsTagTypes.TEXT, id: ListTagTypes.PARTIAL_LIST });

export const textsQuerySlice = textsApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getTexts: builder.query<ListText[], IGetTextsParams>({
      query: (params) => ({ url: '/texts', params: paramsWithGlobalQueries(params) }),
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
