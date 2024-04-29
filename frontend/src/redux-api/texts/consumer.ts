import { createApi } from '@reduxjs/toolkit/query/react';
import { IGetConsumerTextParams, IGetConsumerTextsParams } from '@app/types/common-text-types';
import { IConsumerText } from '@app/types/texts/consumer';
import { KABAL_TEXT_TEMPLATES_BASE_QUERY } from '../common';

export enum ConsumerTextsTagTypes {
  TEXT = 'consumer-text',
}

export const consumerTextsApi = createApi({
  reducerPath: 'consumerTextsApi',
  baseQuery: KABAL_TEXT_TEMPLATES_BASE_QUERY,
  tagTypes: Object.values(ConsumerTextsTagTypes),
  endpoints: (builder) => ({
    getConsumerTexts: builder.query<IConsumerText[], IGetConsumerTextsParams>({
      query: ({ language, ...params }) => ({ url: `/consumer/texts/${language}`, params }),
      providesTags: (texts, _, { language }) =>
        texts === undefined
          ? [ConsumerTextsTagTypes.TEXT]
          : [
              ...texts.map(({ id }) => ({ type: ConsumerTextsTagTypes.TEXT, id: `${id}-${language}` })),
              ConsumerTextsTagTypes.TEXT,
            ],
      onQueryStarted: async ({ language }, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        for (const text of data) {
          dispatch(
            consumerTextsApi.util.updateQueryData('getConsumerTextById', { textId: text.id, language }, () => text),
          );
        }
      },
    }),
    getConsumerTextById: builder.query<IConsumerText, IGetConsumerTextParams>({
      query: ({ textId, language }) => `/consumer/texts/${textId}/${language}`,
      providesTags: (_, __, { textId, language }) => [
        { type: ConsumerTextsTagTypes.TEXT, id: `${textId}-${language}` },
      ],
    }),
  }),
});

export const { useGetConsumerTextsQuery, useLazyGetConsumerTextsQuery, useLazyGetConsumerTextByIdQuery } =
  consumerTextsApi;
