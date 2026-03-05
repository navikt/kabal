import { KABAL_TEXT_TEMPLATES_BASE_QUERY } from '@app/redux-api/common';
import { createApi } from '@reduxjs/toolkit/query/react';

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
