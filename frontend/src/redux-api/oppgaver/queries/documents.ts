import { queryStringify } from '../../../functions/query-string';
import { IArkiverteDocumentsResponse } from '../../../types/arkiverte-documents';
import { IMainDocument } from '../../../types/documents/documents';
import { IGetDokumenterParams, IOppgavebehandlingBaseParams } from '../../../types/oppgavebehandling/params';
import { DOMAIN, IS_LOCALHOST, KABAL_BEHANDLINGER_BASE_PATH } from '../../common';
import { ServerSentEventManager, ServerSentEventType } from '../../server-sent-events';
import { oppgaverApi } from '../oppgaver';

export const documentsQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getDocuments: builder.query<IMainDocument[], IOppgavebehandlingBaseParams>({
      query: ({ oppgaveId }) => `/kabal-api/behandlinger/${oppgaveId}/dokumenter`,
      onCacheEntryAdded: async ({ oppgaveId }, { updateCachedData, dispatch, cacheEntryRemoved, cacheDataLoaded }) => {
        try {
          await cacheDataLoaded;

          const events = new ServerSentEventManager(
            `${DOMAIN}${KABAL_BEHANDLINGER_BASE_PATH}/${oppgaveId}/dokumenter/events`
          );

          events.addEventListener(ServerSentEventType.FINISHED, (event) => {
            if (event.data.length !== 0) {
              updateCachedData((draft) => {
                if (typeof draft === 'undefined' || draft.length === 0) {
                  return draft;
                }

                const filteredList = draft.filter(({ id, parent }) => !(id === event.data || parent === event.data)); // Remove finished document from list.

                if (filteredList.length !== draft.length) {
                  dispatch(oppgaverApi.util.invalidateTags(['dokumenter', 'tilknyttedeDokumenter']));
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
    getArkiverteDokumenter: builder.query<IArkiverteDocumentsResponse, IGetDokumenterParams>({
      query: ({ oppgaveId, pageReference, temaer }) => {
        const query = queryStringify({
          antall: 10,
          forrigeSide: pageReference,
          temaer,
        });
        return `/kabal-api/klagebehandlinger/${oppgaveId}/arkivertedokumenter${query}`;
      },
      providesTags: ['dokumenter'],
    }),
    getTilknyttedeDokumenter: builder.query<IArkiverteDocumentsResponse, string>({
      query: (oppgaveId) => `/kabal-api/klagebehandlinger/${oppgaveId}/dokumenttilknytninger`,
      providesTags: ['tilknyttedeDokumenter'],
    }),
  }),
});

export const { useGetDocumentsQuery, useGetArkiverteDokumenterQuery, useGetTilknyttedeDokumenterQuery } =
  documentsQuerySlice;
