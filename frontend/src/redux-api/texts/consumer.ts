import { createApi } from '@reduxjs/toolkit/query/react';
import { KABAL_TEXT_TEMPLATES_BASE_QUERY } from '@/redux-api/common';
import type {
  IGetConsumerGodFormuleringParams,
  IGetConsumerHeaderFooterParams,
  IGetConsumerRegelverkParams,
  IGetConsumerTextParams,
  IGetConsumerTextsParams,
} from '@/types/common-text-types';
import type { IConsumerText } from '@/types/texts/consumer';

export enum ConsumerTextsTagTypes {
  TEXT = 'consumer-text',
}

type Params =
  | IGetConsumerTextsParams
  | IGetConsumerGodFormuleringParams
  | IGetConsumerRegelverkParams
  | IGetConsumerHeaderFooterParams;

export const consumerTextsApi = createApi({
  reducerPath: 'consumerTextsApi',
  baseQuery: KABAL_TEXT_TEMPLATES_BASE_QUERY,
  tagTypes: Object.values(ConsumerTextsTagTypes),
  endpoints: (builder) => ({
    getConsumerTexts: builder.query<IConsumerText[], Params>({
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
