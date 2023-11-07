import { createApi } from '@reduxjs/toolkit/query/react';
import { IGetTextsParams } from '@app/types/common-text-types';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { IPublishedRichText } from '@app/types/texts/responses';
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
    getConsumerMaltekstseksjoner: builder.query<IMaltekstseksjon[], IGetTextsParams>({
      query: (params) => ({ url: '/consumer/maltekstseksjoner', params }),
      providesTags: (maltekstseksjoner) =>
        maltekstseksjoner?.map(({ id }) => ({ type: ConsumerMaltekstseksjonerTagTypes.MALTEKSTSEKSJON, id })) ?? [],
    }),
    getMaltekstseksjonTexts: builder.query<IPublishedRichText[], string>({
      query: (id) => `/consumer/maltekstseksjoner/${id}/texts`,
      providesTags: (_, __, id) => [{ type: ConsumerMaltekstseksjonerTagTypes.MALTEKSTSEKSJON_TEXTS, id }],
    }),
  }),
});

export const { useLazyGetMaltekstseksjonTextsQuery, useLazyGetConsumerMaltekstseksjonerQuery } =
  consumerMaltekstseksjonerApi;
