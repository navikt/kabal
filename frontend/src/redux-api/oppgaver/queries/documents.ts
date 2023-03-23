import { queryStringify } from '@app/functions/query-string';
import { IArkiverteDocumentsResponse } from '@app/types/arkiverte-documents';
import { IDocumentParams } from '@app/types/documents/common-params';
import { IMainDocument } from '@app/types/documents/documents';
import { IValidateDocumentResponse } from '@app/types/documents/validation';
import { IS_LOCALHOST, KABAL_BEHANDLINGER_BASE_PATH } from '../../common';
import { ServerSentEventManager, ServerSentEventType } from '../../server-sent-events';
import { ListTagTypes } from '../../tag-types';
import { DokumenterListTagTypes, oppgaverApi } from '../oppgaver';

const dokumenterListTags = (type: DokumenterListTagTypes) => (result: IArkiverteDocumentsResponse | undefined) =>
  typeof result === 'undefined'
    ? [{ type, id: ListTagTypes.PARTIAL_LIST }]
    : result.dokumenter
        .map(({ journalpostId, dokumentInfoId }) => ({ id: `${journalpostId}-${dokumentInfoId}`, type }))
        .concat({ type, id: ListTagTypes.PARTIAL_LIST });

export const documentsQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getDocuments: builder.query<IMainDocument[], string>({
      query: (oppgaveId) => `/kabal-api/behandlinger/${oppgaveId}/dokumenter`,
      onCacheEntryAdded: async (oppgaveId, { updateCachedData, dispatch, cacheEntryRemoved, cacheDataLoaded }) => {
        try {
          await cacheDataLoaded;

          const events = new ServerSentEventManager(`${KABAL_BEHANDLINGER_BASE_PATH}/${oppgaveId}/dokumenter/events`);

          events.addEventListener(ServerSentEventType.FINISHED, (event) => {
            if (event.data.length !== 0) {
              updateCachedData((draft) => {
                if (typeof draft === 'undefined' || draft.length === 0) {
                  return draft;
                }

                const filteredList = draft.filter(({ id, parent }) => !(id === event.data || parent === event.data)); // Remove finished document from list.

                if (filteredList.length !== draft.length) {
                  dispatch(
                    oppgaverApi.util.invalidateTags([
                      { type: DokumenterListTagTypes.DOKUMENTER, id: ListTagTypes.PARTIAL_LIST },
                      { type: DokumenterListTagTypes.TILKNYTTEDEDOKUMENTER, id: ListTagTypes.PARTIAL_LIST },
                    ])
                  );
                }

                return filteredList;
              });
            }
          });

          await cacheEntryRemoved;

          events.close();
        } catch (err) {
          console.error(err);
        }
      },
    }),
    getArkiverteDokumenter: builder.query<IArkiverteDocumentsResponse, string>({
      query: (oppgaveId) => {
        const query = queryStringify({
          antall: 50000,
          forrigeSide: null,
        });

        return `/kabal-api/klagebehandlinger/${oppgaveId}/arkivertedokumenter${query}`;
      },
      providesTags: dokumenterListTags(DokumenterListTagTypes.DOKUMENTER),
    }),
    getTilknyttedeDokumenter: builder.query<IArkiverteDocumentsResponse, string>({
      query: (oppgaveId) => `/kabal-api/klagebehandlinger/${oppgaveId}/dokumenttilknytninger`,
      providesTags: dokumenterListTags(DokumenterListTagTypes.TILKNYTTEDEDOKUMENTER),
    }),
    validateDocument: builder.query<IValidateDocumentResponse, IDocumentParams>({
      query: ({ oppgaveId, dokumentId }) => `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}/validate`,
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useGetArkiverteDokumenterQuery,
  useGetTilknyttedeDokumenterQuery,
  useLazyValidateDocumentQuery,
} = documentsQuerySlice;
