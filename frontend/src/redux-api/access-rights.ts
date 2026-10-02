import { createApi } from '@reduxjs/toolkit/query/react';
import { toast } from '@/components/toast/store';
import { INNSTILLINGER_BASE_QUERY } from '@/redux-api/common';

interface Saksbehandler {
  saksbehandlerIdent: string;
  saksbehandlerName: string;
}

export interface SaksbehandlerAccessRights extends Saksbehandler {
  ytelseIdList: string[];
  created: string | null;
  accessRightsModified: string | null;
  anketeam: boolean;
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
  enhetId: string;
}

interface UpdateAnketeamParams {
  anketeam: AnketeamAccess[];
  enhetId: string;
}

export interface AnketeamAccess {
  saksbehandlerIdent: string;
  anketeam: boolean;
}

export const accessRightsApi = createApi({
  reducerPath: 'accessRightsApi',
  baseQuery: INNSTILLINGER_BASE_QUERY,
  endpoints: (builder) => ({
    getAccessRights: builder.query<SaksbehandlereResponse, string>({
      query: (enhet) => `/enhet/${enhet}/saksbehandlere`,
    }),
    updateAccessRights: builder.mutation<SaksbehandlereResponse, UpdateAccessRightsParams>({
      query: ({ accessRights }) => ({
        method: 'PUT',
        url: '/ansatte/setytelser',
        body: { accessRights },
      }),
      onQueryStarted: async ({ enhetId }, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;
        dispatch(accessRightsApi.util.updateQueryData('getAccessRights', enhetId, () => data));
        toast.success('Tilgangsstyring er lagret');
      },
    }),
    updateAnketeam: builder.mutation<SaksbehandlereResponse, UpdateAnketeamParams>({
      query: ({ anketeam }) => ({
        method: 'PUT',
        url: '/ansatte/setanketeam',
        body: { anketeam },
      }),
      onQueryStarted: async ({  enhetId }, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;
        dispatch(accessRightsApi.util.updateQueryData('getAccessRights', enhetId, () => data));
        toast.success('Anketeam er lagret');
      },
    }),
  }),
});

export const { useGetAccessRightsQuery, useUpdateAccessRightsMutation, useUpdateAnketeamMutation } = accessRightsApi;
