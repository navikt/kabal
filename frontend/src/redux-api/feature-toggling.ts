import { createApi } from '@reduxjs/toolkit/query/react';
import { FEATURE_TOGGLE_BASE_QUERY } from './common';

export enum FeatureToggles {
  SMART_EDITOR = 'klage.smarteditor',
}

export const featureTogglingApi = createApi({
  reducerPath: 'featureTogglingApi',
  baseQuery: FEATURE_TOGGLE_BASE_QUERY,
  endpoints: (builder) => ({
    getFeatureToggle: builder.query<boolean, FeatureToggles>({
      query: (key) => `/${key}`,
      transformResponse: (response: boolean) => (process.env.NODE_ENV === 'development' ? true : response),
    }),
  }),
});

export const { useGetFeatureToggleQuery } = featureTogglingApi;
