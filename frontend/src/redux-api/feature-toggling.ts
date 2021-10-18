import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { staggeredBaseQuery } from './common';

export const featureTogglingApi = createApi({
  reducerPath: 'featureTogglingApi',
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    getFeatureTogglingEditor: builder.query<boolean, void>({
      query: () => '/api/featuretoggle/klage.smarteditor',
    }),
  }),
});

export const { useGetFeatureTogglingEditorQuery } = featureTogglingApi;
