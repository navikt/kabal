import { createApi } from '@reduxjs/toolkit/query/react';
import { KABAL_TEXT_TEMPLATES_BASE_QUERY } from '../common';

export enum MaltekstseksjonTagTypes {
  MALTEKSTSEKSJON = 'maltekstseksjon',
  MALTEKSTSEKSJON_VERSIONS = 'maltekstseksjon-versions',
}

export const maltekstseksjonerApi = createApi({
  reducerPath: 'maltekstseksjonererApi',
  baseQuery: KABAL_TEXT_TEMPLATES_BASE_QUERY,
  tagTypes: Object.values(MaltekstseksjonTagTypes),
  endpoints: () => ({}),
});
