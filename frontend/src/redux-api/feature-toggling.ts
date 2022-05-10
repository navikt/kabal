import { createApi } from '@reduxjs/toolkit/query/react';
import { FEATURE_TOGGLE_BASE_QUERY } from './common';

export enum FeatureToggles {
  MALTEKSTER = 'klage.maltekster',
}

export const featureTogglingApi = createApi({
  reducerPath: 'featureTogglingApi',
  baseQuery: FEATURE_TOGGLE_BASE_QUERY,
  endpoints: (builder) => ({
    getFeatureToggle: builder.query<boolean, FeatureToggles>({
      query: (key) => `/${key}`,
    }),
  }),
});

export const { useGetFeatureToggleQuery } = featureTogglingApi;
