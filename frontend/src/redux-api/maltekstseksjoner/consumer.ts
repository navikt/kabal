import type {
  IGetConsumerMaltekstseksjonerParams,
  IGetConsumerMaltekstseksjonTextsParams,
} from '@app/types/common-text-types';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import type { IConsumerRichText } from '@app/types/texts/consumer';
import { createApi } from '@reduxjs/toolkit/query/react';
import { KABAL_TEXT_TEMPLATES_BASE_QUERY } from '../common';

export enum ConsumerMaltekstseksjonerTagTypes {
  TEXT = 'consumer-text',
  MALTEKSTSEKSJON = 'consumer-maltekstseksjon',
  MALTEKSTSEKSJON_TEXTS = 'consumer-maltekstseksjon-texts',
}

export const consumerMaltekstseksjonerApi = createApi({
  reducerPath: 'consumerMaltekstseksjonerApi',
  baseQuery: KABAL_TEXT_TEMPLATES_BASE_QUERY,
  tagTypes: Object.values(ConsumerMaltekstseksjonerTagTypes),
  endpoints: (builder) => ({
    getConsumerMaltekstseksjoner: builder.query<IMaltekstseksjon[], IGetConsumerMaltekstseksjonerParams>({
      query: (params) => ({ url: '/consumer/maltekstseksjoner', params }),
      providesTags: (maltekstseksjoner) =>
        maltekstseksjoner?.map(({ id }) => ({ type: ConsumerMaltekstseksjonerTagTypes.MALTEKSTSEKSJON, id })) ?? [],
    }),
    getMaltekstseksjonTexts: builder.query<IConsumerRichText[], IGetConsumerMaltekstseksjonTextsParams>({
      query: ({ id, language }) => `/consumer/maltekstseksjoner/${id}/texts/${language}`,
      providesTags: (_, __, { id, language }) => [
        { type: ConsumerMaltekstseksjonerTagTypes.MALTEKSTSEKSJON_TEXTS, id, language },
      ],
    }),
  }),
});

export const {
  useGetMaltekstseksjonTextsQuery,
  useLazyGetMaltekstseksjonTextsQuery,
  useLazyGetConsumerMaltekstseksjonerQuery,
} = consumerMaltekstseksjonerApi;
