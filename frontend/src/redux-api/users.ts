import { createApi } from '@reduxjs/toolkit/query/react';
import { KLAGE_LOOKUP_API_BASE_QUERY } from '@/redux-api/common';
import type { UserInfo } from '@/types/bruker';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: KLAGE_LOOKUP_API_BASE_QUERY,
  endpoints: (builder) => ({
    getUserInfo: builder.query<UserInfo, { navIdent: string }>({
      query: ({ navIdent }) => ({ url: `/users/${navIdent}`, method: 'GET' }),
    }),
  }),
});

export const { useGetUserInfoQuery } = userApi;
