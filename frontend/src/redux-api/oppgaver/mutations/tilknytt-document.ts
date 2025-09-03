import { apiErrorToast, apiRejectionErrorToast } from '@app/components/toast/toast-content/api-error-toast';
import { ENVIRONMENT } from '@app/environment';
import { behandlingerQuerySlice } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { isApiRejectionError } from '@app/types/errors';
import type { IBatchDocumentParams } from '@app/types/oppgavebehandling/params';
import { ListTagTypes } from '../../tag-types';
import { DokumenterListTagTypes, oppgaverApi } from '../oppgaver';

const tilknyttDokumentMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
  endpoints: (builder) => ({
    tilknyttDocuments: builder.mutation<void, IBatchDocumentParams>({
      query: ({ oppgaveId, documentIdList }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenttilknytninger`,
        method: 'POST',
        body: { journalfoertDokumentReferenceSet: documentIdList },
      }),
      invalidatesTags: (_, __, { documentIdList }) => [
        ...documentIdList.map((d) => ({
          type: DokumenterListTagTypes.TILKNYTTEDEDOKUMENTER,
          id: `${d.journalpostId}-${d.dokumentInfoId}`,
        })),
        { type: DokumenterListTagTypes.TILKNYTTEDEDOKUMENTER, id: ListTagTypes.PARTIAL_LIST },
      ],
      onQueryStarted: async ({ oppgaveId, documentIdList }, { dispatch, queryFulfilled }) => {
        const detailsResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            for (const add of documentIdList) {
              if (
                !draft.tilknyttedeDokumenter.some(
                  (d) => d.journalpostId === add.journalpostId && d.dokumentInfoId === add.dokumentInfoId,
                )
              ) {
                draft.tilknyttedeDokumenter.push(add);
              }
            }

            return draft;
          }),
        );

        try {
          await queryFulfilled;
        } catch (error) {
          detailsResult.undo();

          const heading = `Kunne ikke tilknytte ${documentIdList.length === 1 ? 'dokument' : 'dokumenter'}`;

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
        }
      },
    }),
  }),
});

export const { useTilknyttDocumentsMutation } = tilknyttDokumentMutationSlice;
