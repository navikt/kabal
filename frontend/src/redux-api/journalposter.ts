import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { KABAL_API_BASE_QUERY } from './common';
import { documentsQuerySlice } from './oppgaver/queries/documents';

interface ISetTitleUpdate {
  journalpostId: string;
  dokumentInfoId: string;
  oppgaveId: string;
  tittel: string;
}

interface ISetTitleResponse {
  tittel: string;
}

export const journalposterApi = createApi({
  reducerPath: 'journalposterApi',
  baseQuery: KABAL_API_BASE_QUERY,
  endpoints: (builder) => ({
    setTitle: builder.mutation<ISetTitleResponse, ISetTitleUpdate>({
      query: ({ journalpostId, dokumentInfoId, tittel }) => ({
        url: `/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/tittel`,
        method: 'PUT',
        body: { tittel },
      }),
      onQueryStarted: async ({ tittel, journalpostId, dokumentInfoId, oppgaveId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          documentsQuerySlice.util.updateQueryData('getArkiverteDokumenter', oppgaveId, (draft) => {
            draft.dokumenter = draft.dokumenter.map((d) => {
              if (d.journalpostId === journalpostId) {
                if (d.dokumentInfoId === dokumentInfoId) {
                  return { ...d, tittel };
                }

                return {
                  ...d,
                  vedlegg: d.vedlegg.map((v) => {
                    if (v.dokumentInfoId === dokumentInfoId) {
                      return { ...v, tittel };
                    }

                    return v;
                  }),
                };
              }

              return d;
            });
          })
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

export const { useSetTitleMutation } = journalposterApi;
