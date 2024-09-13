import { toast } from '@app/components/toast/store';
import { createApi } from '@reduxjs/toolkit/query/react';
import { INNSTILLINGER_BASE_QUERY } from './common';

export interface SaksbehandlerAccessRights {
  saksbehandlerIdent: string;
  saksbehandlerName: string;
  ytelseIdList: string[];
  created: string | null;
  accessRightsModified: string | null;
}

interface SaksbehandlereResponse {
  accessRights: SaksbehandlerAccessRights[];
}

interface SaksbehandlerAccessRightUpdate {
  saksbehandlerIdent: string;
  ytelseIdList: string[];
}

interface UpdateAccessRightsParams {
  accessRights: SaksbehandlerAccessRightUpdate[];
}

export const accessRightsApi = createApi({
  reducerPath: 'accessRightsApi',
  baseQuery: INNSTILLINGER_BASE_QUERY,
  endpoints: (builder) => ({
    getAccessRights: builder.query<SaksbehandlereResponse, string>({
      query: (enhet) => `/enhet/${enhet}/saksbehandlere`,
    }),
    updateAccessRights: builder.mutation<SaksbehandlereResponse, UpdateAccessRightsParams>({
      query: (body) => ({
        method: 'PUT',
        url: '/ansatte/setytelser',
        body,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        await queryFulfilled;
        toast.success('Tilgangsstyring er lagret');
      },
    }),
  }),
});

export const { useGetAccessRightsQuery, useUpdateAccessRightsMutation } = accessRightsApi;
