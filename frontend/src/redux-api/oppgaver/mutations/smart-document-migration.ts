import { documentsQuerySlice } from '@app/redux-api/oppgaver/queries/documents';
import { ISmartDocument } from '@app/types/documents/documents';
import { IMigrateSmartDocumentsParams } from '@app/types/oppgavebehandling/params';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';

const smartDocumentMigrationMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    migrateUpdateSmartEditors: builder.mutation<ISmartDocument[], IMigrateSmartDocumentsParams>({
      query: ({ oppgaveId, body }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/smartdokumenter`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ oppgaveId }, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        data.forEach((s) => {
          dispatch(documentsQuerySlice.util.updateQueryData('getDocument', { oppgaveId, dokumentId: s.id }, () => s));
        });

        dispatch(
          documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) => {
            draft.map((d) => {
              const updated = data.find(({ id }) => d.id === id);

              return updated ?? d;
            });
          }),
        );
      },
    }),
  }),
});

// eslint-disable-next-line import/no-unused-modules
export const { useMigrateUpdateSmartEditorsMutation } = smartDocumentMigrationMutationSlice;
