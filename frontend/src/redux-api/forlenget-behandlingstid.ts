import { ISO_FORMAT } from '@app/components/date-picker/constants';
import { toast } from '@app/components/toast/store';
import { KABAL_API_BASE_QUERY } from '@app/redux-api/common';
import { reduxStore } from '@app/redux/configure-store';
import type { IMottaker } from '@app/types/documents/documents';
import { mottakerToInputMottaker } from '@app/types/documents/params';
import { BehandlingstidUnitType } from '@app/types/svarbrev';
import { createApi } from '@reduxjs/toolkit/query/react';
import { addMonths, addWeeks, format } from 'date-fns';

export interface IForlengetBehandlingstid {
  title: string | null;
  fullmektigFritekst: string | null;
  customText: string | null;
  reason: string | null;
  previousBehandlingstidInfo: string | null;
  behandlingstid: {
    varsletBehandlingstidUnitTypeId: BehandlingstidUnitType;
    varsletBehandlingstidUnits: number | null;
    varsletFrist: string | null;
  };
  receivers: IMottaker[];
  doNotSendLetter: boolean;
  reasonNoLetter: string | null;
  timesPreviouslyExtended: number;
}

const getPath = (id: string, subPath?: string) =>
  `/behandlinger/${id}/forlenget-behandlingstid-draft${typeof subPath === 'string' ? `/${subPath}` : ''}`;

export const forlengetBehandlingstidApi = createApi({
  reducerPath: 'forlengetBehandlingstidApi',
  baseQuery: KABAL_API_BASE_QUERY,
  endpoints: (builder) => ({
    getOrCreate: builder.query<IForlengetBehandlingstid, string>({
      query: (id) => ({ url: getPath(id), method: 'POST' }),
    }),
    setTitle: builder.mutation<IForlengetBehandlingstid, { title: string; id: string }>({
      query: ({ id, ...body }) => ({ url: getPath(id, 'title'), method: 'PUT', body }),
      onQueryStarted: (params, { queryFulfilled }) => optimisticUpdate(params, queryFulfilled),
    }),
    setFullmektigFritekst: builder.mutation<
      IForlengetBehandlingstid,
      { id: string; fullmektigFritekst: string | null }
    >({
      query: ({ id, ...body }) => ({ url: getPath(id, 'fullmektig-fritekst'), method: 'PUT', body }),
      onQueryStarted: (params, { queryFulfilled }) => optimisticUpdate(params, queryFulfilled),
    }),
    setCustomText: builder.mutation<IForlengetBehandlingstid, { customText: string | null; id: string }>({
      query: ({ id, ...body }) => ({ url: getPath(id, 'custom-text'), method: 'PUT', body }),
      onQueryStarted: (params, { queryFulfilled }) => optimisticUpdate(params, queryFulfilled),
    }),
    setReason: builder.mutation<IForlengetBehandlingstid, { reason: string | null; id: string }>({
      query: ({ id, ...body }) => ({ url: getPath(id, 'reason'), method: 'PUT', body }),
      onQueryStarted: (params, { queryFulfilled }) => optimisticUpdate(params, queryFulfilled),
    }),
    setPreviousBehandlingstidInfo: builder.mutation<
      IForlengetBehandlingstid,
      { previousBehandlingstidInfo: string | null; id: string }
    >({
      query: ({ id, ...body }) => ({ url: getPath(id, 'previous-behandlingstid-info'), method: 'PUT', body }),
      onQueryStarted: (params, { queryFulfilled }) => optimisticUpdate(params, queryFulfilled),
    }),
    setBehandlingstidUnits: builder.mutation<
      IForlengetBehandlingstid,
      { varsletBehandlingstidUnits: number | null; id: string }
    >({
      query: ({ id, ...body }) => ({ url: getPath(id, 'behandlingstid-units'), method: 'PUT', body }),
      onQueryStarted: ({ id }, { queryFulfilled }) => pessimisticUpdate(id, queryFulfilled),
    }),
    setBehandlingstidUnitType: builder.mutation<
      IForlengetBehandlingstid,
      { varsletBehandlingstidUnitTypeId: BehandlingstidUnitType; id: string }
    >({
      query: ({ id, ...body }) => ({ url: getPath(id, 'behandlingstid-unit-type-id'), method: 'PUT', body }),
      onQueryStarted: async ({ id, varsletBehandlingstidUnitTypeId }, { queryFulfilled }) => {
        const patchResult = reduxStore.dispatch(
          updateQueryData('getOrCreate', id, (draft) => {
            if (draft.behandlingstid.varsletBehandlingstidUnits === null) {
              return { ...draft, behandlingstid: { ...draft.behandlingstid, varsletBehandlingstidUnitTypeId } };
            }

            return {
              ...draft,
              behandlingstid: { ...draft.behandlingstid, varsletBehandlingstidUnitTypeId, varsletFrist: null },
            };
          }),
        );

        await pessimisticUpdate(id, queryFulfilled, patchResult.undo);
      },
    }),
    setBehandlingstidDate: builder.mutation<
      IForlengetBehandlingstid,
      { behandlingstidDate: string | null; id: string }
    >({
      query: ({ id, ...body }) => ({ url: getPath(id, 'behandlingstid-date'), method: 'PUT', body }),
      onQueryStarted: ({ id }, { queryFulfilled }) => pessimisticUpdate(id, queryFulfilled),
    }),
    setReceivers: builder.mutation<IForlengetBehandlingstid, { mottakerList: IMottaker[]; id: string }>({
      query: ({ id, mottakerList }) => ({
        url: getPath(id, 'receivers'),
        method: 'PUT',
        body: { mottakerList: mottakerList.map(mottakerToInputMottaker) },
      }),
      onQueryStarted: (params, { queryFulfilled }) => optimisticUpdate(params, queryFulfilled),
    }),
    setDoNotSendBrev: builder.mutation<IForlengetBehandlingstid, { doNotSendLetter: boolean; id: string }>({
      query: ({ id, ...body }) => ({ url: getPath(id, 'do-not-send-letter'), method: 'PUT', body }),
      onQueryStarted: (params, { queryFulfilled }) => optimisticUpdate(params, queryFulfilled),
    }),
    setReasonNoLetter: builder.mutation<IForlengetBehandlingstid, { reasonNoLetter: string | null; id: string }>({
      query: ({ id, ...body }) => ({ url: getPath(id, 'reason-no-letter'), method: 'PUT', body }),
      onQueryStarted: (params, { queryFulfilled }) => optimisticUpdate(params, queryFulfilled),
    }),
    complete: builder.mutation<void, { id: string; doNotSendLetter: boolean; onClose: () => void }>({
      query: ({ id }) => ({ url: getPath(id, 'complete'), method: 'POST' }),
      onQueryStarted: async ({ onClose, doNotSendLetter }, { queryFulfilled, dispatch }) => {
        await queryFulfilled;

        // Ensure modal is closed before resetting API in order to avoid refetch
        onClose();
        dispatch(forlengetBehandlingstidApi.util.resetApiState());

        toast.success(
          doNotSendLetter ? 'Varslet frist er endret' : 'Brev om lengre saksbehandlingstid er satt til utsending',
        );
      },
    }),
  }),
});

const NOW = new Date();

export const getNewDate = (units: number, varsletBehandlingstidUnitTypeId: BehandlingstidUnitType): string => {
  switch (varsletBehandlingstidUnitTypeId) {
    case BehandlingstidUnitType.WEEKS:
      return format(addWeeks(NOW, units), ISO_FORMAT);
    case BehandlingstidUnitType.MONTHS:
      return format(addMonths(NOW, units), ISO_FORMAT);
  }
};

type QueryFulfiled = Promise<{ data: IForlengetBehandlingstid }>;
type Update = Partial<IForlengetBehandlingstid> & { id: string };
const { updateQueryData } = forlengetBehandlingstidApi.util;

const optimisticUpdate = async ({ id, ...update }: Update, queryFulfilled: QueryFulfiled) => {
  const patchResult = reduxStore.dispatch(updateQueryData('getOrCreate', id, (draft) => ({ ...draft, ...update })));

  await pessimisticUpdate(id, queryFulfilled, patchResult.undo);
};

const pessimisticUpdate = async (id: string, queryFulfilled: QueryFulfiled, undo = () => {}) => {
  try {
    const { data } = await queryFulfilled;

    reduxStore.dispatch(updateQueryData('getOrCreate', id, (draft) => ({ ...draft, ...data })));
  } catch {
    undo();
  }
};

export const {
  useGetOrCreateQuery,
  useSetBehandlingstidUnitTypeMutation,
  useSetBehandlingstidUnitsMutation,
  useSetBehandlingstidDateMutation,
  useSetCustomTextMutation,
  useSetFullmektigFritekstMutation,
  useSetReasonMutation,
  useSetTitleMutation,
  useSetReceiversMutation,
  useSetPreviousBehandlingstidInfoMutation,
  useSetDoNotSendBrevMutation,
  useSetReasonNoLetterMutation,
  useCompleteMutation,
} = forlengetBehandlingstidApi;
