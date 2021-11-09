import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';

export const featureTogglingApi = createApi({
  reducerPath: 'featureTogglingApi',
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    getFeatureTogglingEditor: builder.query<boolean, void>({
      query: () => '/api/kabal-api/featuretoggle/klage.smarteditor',
      transformResponse: (response: boolean) => (process.env.NODE_ENV === 'development' ? true : response),
    }),
    getFeatureToggleIndexFromSearch: builder.query<boolean, void>({
      query: () => '/api/kabal-api/featuretoggle/klage.indexFromSearch',
    }),
  }),
});

export const { useGetFeatureTogglingEditorQuery, useGetFeatureToggleIndexFromSearchQuery } = featureTogglingApi;
