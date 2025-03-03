import { KABAL_API_BASE_QUERY } from '@app/redux-api/common';
import type { IMottaker } from '@app/types/documents/documents';
import type { SvarbrevSetting } from '@app/types/svarbrev';
import { createApi } from '@reduxjs/toolkit/query/react';

export const svarbrevApi = createApi({
  reducerPath: 'svarbrevApi',
  baseQuery: KABAL_API_BASE_QUERY,
  endpoints: (builder) => ({
    setTitle: builder.query<SvarbrevSetting[], { title: string; id: string }>({
      query: ({ id, ...body }) => ({ url: `/behandlinger/${id}/forlengetbehandlingstid/title`, method: 'PUT', body }),
    }),
    setFullmektigFritekst: builder.query<SvarbrevSetting[], { id: string; fullmektigFritekst: string }>({
      query: ({ id, ...body }) => ({
        url: `/behandlinger/${id}/forlengetbehandlingstid/fullmektig-fritekst`,
        method: 'PUT',
        body,
      }),
    }),
    setCustomText: builder.query<SvarbrevSetting[], { customText: string; id: string }>({
      query: ({ id, ...body }) => ({
        url: `/behandlinger/${id}/forlengetbehandlingstid/customText`,
        method: 'PUT',
        body,
      }),
    }),
    setReason: builder.query<SvarbrevSetting[], { reason: string; id: string }>({
      query: ({ id, ...body }) => ({ url: `/behandlinger/${id}/forlengetbehandlingstid/reason`, method: 'PUT', body }),
    }),
    setBehandlingstidUnits: builder.query<SvarbrevSetting[], { units: number; id: string }>({
      query: ({ id, ...body }) => ({
        url: `/behandlinger/${id}/forlengetbehandlingstid/behandlingstid-units`,
        method: 'PUT',
        body,
      }),
    }),
    setBehandlingstidUnitType: builder.query<SvarbrevSetting[], { typeId: string; id: string }>({
      query: ({ id, ...body }) => ({
        url: `/behandlinger/${id}/forlengetbehandlingstid/behandlingstid-unit-type-id`,
        method: 'PUT',
        body,
      }),
    }),
    setBehandlngstidDate: builder.query<SvarbrevSetting[], { date: string; id: string }>({
      query: ({ id, ...body }) => ({
        url: `/behandlinger/${id}/forlengetbehandlingstid/behandlingstid-date`,
        method: 'PUT',
        body,
      }),
    }),
    setReceivers: builder.query<SvarbrevSetting[], { receivers: IMottaker[]; id: string }>({
      query: ({ id, ...body }) => ({ url: `/behandlinger/${id}/forlengetbehandlingstid/title`, method: 'PUT', body }),
    }),
  }),
});

export const {
  useSetBehandlingstidUnitTypeQuery,
  useSetBehandlingstidUnitsQuery,
  useSetBehandlngstidDateQuery,
  useSetCustomTextQuery,
  useSetFullmektigFritekstQuery,
  useSetReasonQuery,
  useSetTitleQuery,
  useSetReceiversQuery,
} = svarbrevApi;
