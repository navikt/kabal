import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';

export type Date = string; // LocalDate

interface Settings {
  hjemler: string[];
  tema: string[];
  types: string[];
}

export interface PostSettingsParams {
  navIdent: string;
  hjemler: string[];
  tema: string[];
  types: string[];
}

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['settings'],
  endpoints: (builder) => ({
    getSettings: builder.query<Settings, string>({
      query: (navIdent) => `/api/ansatte/${navIdent}/brukerdata/innstillinger`,
      providesTags: ['settings'],
    }),
    updateSettings: builder.mutation<Settings, PostSettingsParams>({
      query: ({ navIdent, ...params }) => ({
        url: `/api/ansatte/${navIdent}/brukerdata/innstillinger`,
        method: 'POST',
        body: { navIdent, ...params },
        validateStatus: ({ ok }) => ok,
        responseHandler: async (): Promise<Settings> => params,
      }),
      invalidatesTags: ['settings'],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
