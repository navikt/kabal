import { createApi } from '@reduxjs/toolkit/query/react';
import { format } from 'date-fns';
import { ISO_DATETIME_FORMAT } from '@app/components/date-picker/constants';
import { documentsQuerySlice } from '@app/redux-api/oppgaver/queries/documents';
import { LogiskVedlegg } from '@app/types/arkiverte-documents';
import { KABAL_API_BASE_QUERY } from './common';

const OPTIMISTIC_LOGISK_VEDLEGG_ID_PREFIX = 'optimistic-logisk-vedlegg';

interface AddParams {
  oppgaveId: string;
  dokumentInfoId: string;
  tittel: string;
}

interface UpdateParams extends LogiskVedlegg {
  oppgaveId: string;
  dokumentInfoId: string;
}

interface RemoveParams {
  oppgaveId: string;
  dokumentInfoId: string;
  logiskVedleggId: string;
}

export const logiskeVedleggApi = createApi({
  reducerPath: 'logiskeVedleggApi',
  baseQuery: KABAL_API_BASE_QUERY,
  endpoints: (builder) => ({
    addLogiskVedlegg: builder.mutation<LogiskVedlegg, AddParams>({
      query: ({ dokumentInfoId, tittel }) => ({
        method: 'POST',
        url: `/journalposter/dokumenter/${dokumentInfoId}/logiskevedlegg`,
        body: { tittel },
      }),
      onQueryStarted: async ({ dokumentInfoId, oppgaveId, tittel }, { dispatch, queryFulfilled }) => {
        const now = format(new Date(), ISO_DATETIME_FORMAT);
        const optimisticId = `${OPTIMISTIC_LOGISK_VEDLEGG_ID_PREFIX}-${now}`;

        const patchResult = dispatch(
          documentsQuerySlice.util.updateQueryData('getArkiverteDokumenter', oppgaveId, ({ dokumenter }) => {
            const logiskeVedlegg: LogiskVedlegg = {
              tittel,
              logiskVedleggId: optimisticId,
            };

            for (const d of dokumenter) {
              if (d.dokumentInfoId === dokumentInfoId) {
                d.logiskeVedlegg.push(logiskeVedlegg);
              }

              for (const v of d.vedlegg) {
                if (v.dokumentInfoId === dokumentInfoId) {
                  v.logiskeVedlegg.push({ tittel, logiskVedleggId: optimisticId });
                }
              }
            }
          }),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            documentsQuerySlice.util.updateQueryData('getArkiverteDokumenter', oppgaveId, ({ dokumenter }) => {
              for (const d of dokumenter) {
                if (d.dokumentInfoId === dokumentInfoId) {
                  replaceLogiskVedlegg(d.logiskeVedlegg, optimisticId, data);
                }

                for (const v of d.vedlegg) {
                  if (v.dokumentInfoId === dokumentInfoId) {
                    replaceLogiskVedlegg(v.logiskeVedlegg, optimisticId, data);
                  }
                }
              }
            }),
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateLogiskVedlegg: builder.mutation<LogiskVedlegg, UpdateParams>({
      query: ({ dokumentInfoId, logiskVedleggId, tittel }) => ({
        method: 'PUT',
        url: `/journalposter/dokumenter/${dokumentInfoId}/logiskevedlegg/${logiskVedleggId}`,
        body: { tittel },
      }),
      onQueryStarted: async ({ oppgaveId, dokumentInfoId, ...logiskVedlegg }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          documentsQuerySlice.util.updateQueryData('getArkiverteDokumenter', oppgaveId, ({ dokumenter }) => {
            for (const d of dokumenter) {
              if (d.dokumentInfoId === dokumentInfoId) {
                replaceLogiskVedlegg(d.logiskeVedlegg, logiskVedlegg.logiskVedleggId, logiskVedlegg);
              }

              for (const v of d.vedlegg) {
                if (v.dokumentInfoId === dokumentInfoId) {
                  replaceLogiskVedlegg(v.logiskeVedlegg, logiskVedlegg.logiskVedleggId, logiskVedlegg);
                }
              }
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    removeLogiskVedlegg: builder.mutation<void, RemoveParams>({
      query: ({ dokumentInfoId, logiskVedleggId }) => ({
        method: 'DELETE',
        url: `/journalposter/dokumenter/${dokumentInfoId}/logiskevedlegg/${logiskVedleggId}`,
      }),
      onQueryStarted: async ({ oppgaveId, dokumentInfoId, logiskVedleggId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          documentsQuerySlice.util.updateQueryData('getArkiverteDokumenter', oppgaveId, ({ dokumenter }) => {
            for (const d of dokumenter) {
              if (d.dokumentInfoId === dokumentInfoId) {
                d.logiskeVedlegg = d.logiskeVedlegg.filter((lv) => lv.logiskVedleggId !== logiskVedleggId);
              }

              for (const v of d.vedlegg) {
                if (v.dokumentInfoId === dokumentInfoId) {
                  v.logiskeVedlegg = v.logiskeVedlegg.filter((lv) => lv.logiskVedleggId !== logiskVedleggId);
                }
              }
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

const replaceLogiskVedlegg = (logiskeVedlegg: LogiskVedlegg[], toReplace: string, replacement: LogiskVedlegg) => {
  for (const lv of logiskeVedlegg) {
    if (lv.logiskVedleggId === toReplace) {
      lv.logiskVedleggId = replacement.logiskVedleggId;
      lv.tittel = replacement.tittel;
    }
  }
};

export const { useAddLogiskVedleggMutation, useUpdateLogiskVedleggMutation, useRemoveLogiskVedleggMutation } =
  logiskeVedleggApi;
