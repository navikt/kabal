import { createApi } from '@reduxjs/toolkit/query/react';
import qs from 'qs';
import { staggeredBaseQuery } from '../common';
import { IDokumenterRespons } from './types';

interface IGetDokumenterParams {
  klagebehandlingId: string;
  pageReference: string | null;
  temaer: string[];
}

export const dokumenterApi = createApi({
  reducerPath: 'dokumenterApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['dokumenter', 'tilknyttedeDokumenter'],
  endpoints: (builder) => ({
    getDokumenter: builder.query<IDokumenterRespons, IGetDokumenterParams>({
      query: ({ klagebehandlingId, pageReference, temaer }) => {
        const query = qs.stringify({
          antall: 10,
          forrigeSide: pageReference,
          temaer,
        });
        return `/api/klagebehandlinger/${klagebehandlingId}/alledokumenter?${query}`;
      },
      providesTags: ['dokumenter'],
    }),
    getTilknyttedeDokumenter: builder.query<IDokumenterRespons, string>({
      query: (klagebehandlingId) => `/api/klagebehandlinger/${klagebehandlingId}/dokumenter`,
      providesTags: ['tilknyttedeDokumenter'],
    }),
    // updateKlagebehandling: builder.mutation<string, IKlagebehandling>({
    //   query: (update) => ({
    //     url: `/api/klagebehandlinger/${update.id}/detaljer/editerbare`,
    //     method: 'PUT',
    //     body: update,
    //     validateStatus: ({ ok }) => ok,
    //   }),
    //   invalidatesTags: ['dokumenter'],
    // }),
  }),
});

export const { useGetDokumenterQuery, useGetTilknyttedeDokumenterQuery } = dokumenterApi;
