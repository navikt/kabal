import { createApi } from '@reduxjs/toolkit/query/react';
import qs from 'qs';
import { staggeredBaseQuery } from '../common';
import { IDocumentsResponse } from './types';

interface IGetDokumenterParams {
  klagebehandlingId: string;
  pageReference: string | null;
  temaer: string[];
  pageSize: number;
}

export const dokumenterApi = createApi({
  reducerPath: 'dokumenterApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['dokumenter', 'tilknyttedeDokumenter'],
  endpoints: (builder) => ({
    getDokumenter: builder.query<IDocumentsResponse, IGetDokumenterParams>({
      query: ({ klagebehandlingId, pageReference, temaer }) => {
        const query = qs.stringify(
          {
            antall: 10,
            forrigeSide: pageReference,
            temaer,
          },
          {
            skipNulls: true,
            arrayFormat: 'comma',
          }
        );
        return `/api/klagebehandlinger/${klagebehandlingId}/arkivertedokumenter?${query}`;
      },
      providesTags: ['dokumenter'],
    }),
    getTilknyttedeDokumenter: builder.query<IDocumentsResponse, string>({
      query: (klagebehandlingId) => `/api/klagebehandlinger/${klagebehandlingId}/dokumenttilknytninger`,
      providesTags: ['tilknyttedeDokumenter'],
    }),
  }),
});

export const { useGetDokumenterQuery, useGetTilknyttedeDokumenterQuery, useLazyGetDokumenterQuery } = dokumenterApi;
