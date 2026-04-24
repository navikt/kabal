import { createApi } from '@reduxjs/toolkit/query/react';
import { addMonths, addWeeks, format } from 'date-fns';
import { ISO_FORMAT } from '@/components/date-picker/constants';
import { toast } from '@/components/toast/store';
import { KABAL_API_BASE_QUERY } from '@/redux-api/common';
import type { Dispatch } from '@/redux-api/types';
import type { IMottaker } from '@/types/documents/documents';
import { mottakerToInputMottaker } from '@/types/documents/params';
import { BehandlingstidUnitType } from '@/types/svarbrev';

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
    calculatedFrist: string | null;
  };
  receivers: IMottaker[];
  doNotSendLetter: boolean;
  reasonNoLetter: string | null;
  timesPreviouslyExtended: number;
  varselTypeIsOriginal: boolean;
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
      onQueryStarted: (params, { queryFulfilled, dispatch }) => optimisticUpdate(params, queryFulfilled, dispatch),
    }),
    setFullmektigFritekst: builder.mutation<
      IForlengetBehandlingstid,
      { id: string; fullmektigFritekst: string | null }
    >({
      query: ({ id, ...body }) => ({ url: getPath(id, 'fullmektig-fritekst'), method: 'PUT', body }),
      onQueryStarted: (params, { queryFulfilled, dispatch }) => optimisticUpdate(params, queryFulfilled, dispatch),
    }),
    setCustomText: builder.mutation<IForlengetBehandlingstid, { customText: string | null; id: string }>({
      query: ({ id, ...body }) => ({ url: getPath(id, 'custom-text'), method: 'PUT', body }),
      onQueryStarted: (params, { queryFulfilled, dispatch }) => optimisticUpdate(params, queryFulfilled, dispatch),
    }),
    setReason: builder.mutation<IForlengetBehandlingstid, { reason: string | null; id: string }>({
      query: ({ id, ...body }) => ({ url: getPath(id, 'reason'), method: 'PUT', body }),
      onQueryStarted: (params, { queryFulfilled, dispatch }) => optimisticUpdate(params, queryFulfilled, dispatch),
    }),
    setPreviousBehandlingstidInfo: builder.mutation<
      IForlengetBehandlingstid,
      { previousBehandlingstidInfo: string | null; id: string }
    >({
      query: ({ id, ...body }) => ({ url: getPath(id, 'previous-behandlingstid-info'), method: 'PUT', body }),
      onQueryStarted: (params, { queryFulfilled, dispatch }) => optimisticUpdate(params, queryFulfilled, dispatch),
    }),
    setBehandlingstidUnits: builder.mutation<
      IForlengetBehandlingstid,
      { varsletBehandlingstidUnits: number | null; id: string }
    >({
      query: ({ id, ...body }) => ({ url: getPath(id, 'behandlingstid-units'), method: 'PUT', body }),
      onQueryStarted: ({ id }, { queryFulfilled, dispatch }) => pessimisticUpdate(id, queryFulfilled, dispatch),
    }),
    setBehandlingstidUnitType: builder.mutation<
      IForlengetBehandlingstid,
      { varsletBehandlingstidUnitTypeId: BehandlingstidUnitType; id: string }
    >({
      query: ({ id, ...body }) => ({ url: getPath(id, 'behandlingstid-unit-type-id'), method: 'PUT', body }),
      onQueryStarted: async ({ id, varsletBehandlingstidUnitTypeId }, { queryFulfilled, dispatch }) => {
        const patchResult = dispatch(
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

        await pessimisticUpdate(id, queryFulfilled, dispatch, patchResult.undo);
      },
    }),
    setBehandlingstidDate: builder.mutation<
      IForlengetBehandlingstid,
      { behandlingstidDate: string | null; id: string }
    >({
      query: ({ id, ...body }) => ({ url: getPath(id, 'behandlingstid-date'), method: 'PUT', body }),
      onQueryStarted: ({ id }, { queryFulfilled, dispatch }) => pessimisticUpdate(id, queryFulfilled, dispatch),
    }),
    setReceivers: builder.mutation<IForlengetBehandlingstid, { mottakerList: IMottaker[]; id: string }>({
      query: ({ id, mottakerList }) => ({
        url: getPath(id, 'receivers'),
        method: 'PUT',
        body: { mottakerList: mottakerList.map(mottakerToInputMottaker) },
      }),
      onQueryStarted: (params, { queryFulfilled, dispatch }) => optimisticUpdate(params, queryFulfilled, dispatch),
    }),
    setDoNotSendBrev: builder.mutation<IForlengetBehandlingstid, { doNotSendLetter: boolean; id: string }>({
      query: ({ id, ...body }) => ({ url: getPath(id, 'do-not-send-letter'), method: 'PUT', body }),
      onQueryStarted: async ({ id, doNotSendLetter }, { queryFulfilled, dispatch }) => {
        const patchResult = dispatch(
          updateQueryData('getOrCreate', id, (draft) => {
            return {
              ...draft,
              doNotSendLetter,
              /* The varselTypeIsOriginal checkbox is not shown unless doNotSendLetter is true (i.e. it's a child of doNotSendLetter).
               * Therefore we have to reset varselTypeIsOriginal to false when doNotSendLetter is set to false.
               * But we will not do anything when doNotSendLetter is set to true - now it's up to the user to decide the value of varselTypeIsOriginal
               */
              varselTypeIsOriginal: doNotSendLetter === false ? false : draft.varselTypeIsOriginal,
            };
          }),
        );

        await pessimisticUpdate(id, queryFulfilled, dispatch, patchResult.undo);
      },
    }),
    setReasonNoLetter: builder.mutation<IForlengetBehandlingstid, { reasonNoLetter: string | null; id: string }>({
      query: ({ id, ...body }) => ({ url: getPath(id, 'reason-no-letter'), method: 'PUT', body }),
      onQueryStarted: (params, { queryFulfilled, dispatch }) => optimisticUpdate(params, queryFulfilled, dispatch),
    }),
    setVarselTypeIsOriginal: builder.mutation<IForlengetBehandlingstid, { varselTypeIsOriginal: boolean; id: string }>({
      query: ({ id, ...body }) => ({ url: getPath(id, 'varsel-type-is-original'), method: 'PUT', body }),
      onQueryStarted: (params, { queryFulfilled, dispatch }) => optimisticUpdate(params, queryFulfilled, dispatch),
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

const optimisticUpdate = async ({ id, ...update }: Update, queryFulfilled: QueryFulfiled, dispatch: Dispatch) => {
  const patchResult = dispatch(updateQueryData('getOrCreate', id, (draft) => ({ ...draft, ...update })));

  await pessimisticUpdate(id, queryFulfilled, dispatch, patchResult.undo);
};

const pessimisticUpdate = async (
  id: string,
  queryFulfilled: QueryFulfiled,
  dispatch: Dispatch,
  undo = (): void => undefined,
) => {
  try {
    const { data } = await queryFulfilled;

    dispatch(updateQueryData('getOrCreate', id, (draft) => ({ ...draft, ...data })));
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
  useSetVarselTypeIsOriginalMutation,
  useCompleteMutation,
} = forlengetBehandlingstidApi;
