import { createApi } from '@reduxjs/toolkit/query/react';
import { IGetTextsParams } from '@app/types/common-text-types';
import { IPublishedText } from '@app/types/texts/responses';
import { KABAL_TEXT_TEMPLATES_BASE_QUERY } from '../common';

export enum ConsumerTextsTagTypes {
  TEXT = 'consumer-text',
}

export const consumerTextsApi = createApi({
  reducerPath: 'consumerTextsApi',
  baseQuery: KABAL_TEXT_TEMPLATES_BASE_QUERY,
  tagTypes: Object.values(ConsumerTextsTagTypes),
  endpoints: (builder) => ({
    getConsumerTexts: builder.query<IPublishedText[], IGetTextsParams>({
      query: (params) => ({ url: '/consumer/texts', params }),
      providesTags: (texts) => texts?.map(({ id }) => ({ type: ConsumerTextsTagTypes.TEXT, id })) ?? [],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        for (const text of data) {
          dispatch(consumerTextsApi.util.updateQueryData('getConsumerTextById', text.id, () => text));
        }
      },
    }),
    getConsumerTextById: builder.query<IPublishedText, string>({
      query: (id) => `/consumer/texts/${id}`,
      providesTags: (_, __, id) => [{ type: ConsumerTextsTagTypes.TEXT, id }],
    }),
  }),
});

export const { useGetConsumerTextsQuery, useLazyGetConsumerTextsQuery, useLazyGetConsumerTextByIdQuery } =
  consumerTextsApi;
