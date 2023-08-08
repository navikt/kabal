import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { isApiRejectionError } from '@app/types/errors';
import { ICheckDocumentParams } from '@app/types/oppgavebehandling/params';
import { ITilknyttDocumentResponse } from '@app/types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { ListTagTypes } from '../../tag-types';
import { DokumenterListTagTypes, oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling';

const tilknyttDokumentMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    tilknyttDocument: builder.mutation<ITilknyttDocumentResponse, ICheckDocumentParams>({
      query: ({ oppgaveId, dokumentInfoId, journalpostId }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenttilknytninger`,
        method: 'POST',
        body: {
          journalpostId,
          dokumentInfoId,
        },
        validateStatus: ({ ok }) => ok,
      }),
      invalidatesTags: (_, __, { journalpostId, dokumentInfoId }) => [
        { type: DokumenterListTagTypes.TILKNYTTEDEDOKUMENTER, id: `${journalpostId}-${dokumentInfoId}` },
        { type: DokumenterListTagTypes.TILKNYTTEDEDOKUMENTER, id: ListTagTypes.PARTIAL_LIST },
      ],
      onQueryStarted: async ({ oppgaveId, dokumentInfoId }, { dispatch, queryFulfilled }) => {
        const archiveResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.relevantDocumentIdList = [...draft.relevantDocumentIdList, dokumentInfoId];
          }),
        );

        try {
          await queryFulfilled;
        } catch (e) {
          archiveResult.undo();

          const message = 'Kunne ikke tilknytte dokument.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
  }),
});

export const { useTilknyttDocumentMutation } = tilknyttDokumentMutationSlice;
