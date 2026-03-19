import { createApi } from '@reduxjs/toolkit/query/react';
import { KABAL_TEXT_TEMPLATES_BASE_QUERY } from '@/redux-api/common';

export enum TextsTagTypes {
  TEXT = 'text',
  TEXT_VERSIONS = 'text-versions',
}

export const textsApi = createApi({
  reducerPath: 'textsApi',
  baseQuery: KABAL_TEXT_TEMPLATES_BASE_QUERY,
  tagTypes: Object.values(TextsTagTypes),
  endpoints: () => ({}),
});
