import { IMigrateSmartEditorsParams } from '../../../types/oppgavebehandling/params';
import { ISmartEditor } from '../../../types/smart-editor/smart-editor';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { smartEditorQuerySlice } from '../queries/smart-editor';

const smartEditorMigrationMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    migrateUpdateSmartEditors: builder.mutation<ISmartEditor[], IMigrateSmartEditorsParams>({
      query: ({ oppgaveId, body }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/smartdokumenter`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ oppgaveId }, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        data.forEach((s) => {
          dispatch(
            smartEditorQuerySlice.util.updateQueryData('getSmartEditor', { oppgaveId, dokumentId: s.id }, () => s)
          );
        });

        dispatch(
          smartEditorQuerySlice.util.updateQueryData('getSmartEditors', { oppgaveId }, (draft) => {
            draft.map((d) => {
              const updated = data.find(({ id }) => d.id === id);

              return updated !== undefined ? updated : d;
            });
          })
        );
      },
    }),
  }),
});

// eslint-disable-next-line import/no-unused-modules
export const { useMigrateUpdateSmartEditorsMutation } = smartEditorMigrationMutationSlice;
