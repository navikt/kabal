import type { IShownArchivedDocument } from '@app/components/view-pdf/types';
import { ENVIRONMENT } from '@app/environment';
import type { KabalValue } from '@app/plate/types';
import type { IArkiverteDocumentsResponse } from '@app/types/arkiverte-documents';
import type { IDocumentParams } from '@app/types/documents/common-params';
import type { IDocument, IMergedDocumentsResponse, ISmartDocumentVersion } from '@app/types/documents/documents';
import type { IGetVersionParams } from '@app/types/documents/params';
import type { IValidateDocumentResponse } from '@app/types/documents/validation';
import { ListTagTypes } from '../../tag-types';
import { DokumenterListTagTypes, oppgaverApi } from '../oppgaver';

const dokumenterListTags = (type: DokumenterListTagTypes) => (result: IArkiverteDocumentsResponse | undefined) =>
  typeof result === 'undefined'
    ? [{ type, id: ListTagTypes.PARTIAL_LIST }]
    : result.dokumenter
        .map(({ journalpostId, dokumentInfoId }) => ({ id: `${journalpostId}-${dokumentInfoId}`, type }))
        .concat({ type, id: ListTagTypes.PARTIAL_LIST });

export const documentsQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
  endpoints: (builder) => ({
    getDocument: builder.query<IDocument, IDocumentParams>({
      query: ({ oppgaveId, dokumentId }) => `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}`,
    }),
    getDocuments: builder.query<IDocument[], string>({
      query: (oppgaveId) => `/kabal-api/behandlinger/${oppgaveId}/dokumenter`,
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        for (const document of data) {
          dispatch(
            documentsQuerySlice.util.updateQueryData(
              'getDocument',
              { oppgaveId, dokumentId: document.id },
              () => document,
            ),
          );
        }
      },
    }),
    getArkiverteDokumenter: builder.query<IArkiverteDocumentsResponse, string>({
      query: (oppgaveId) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/arkivertedokumenter`,
        params: { antall: 50000, forrigeSide: null },
      }),
      providesTags: dokumenterListTags(DokumenterListTagTypes.DOKUMENTER),
    }),
    validateDocument: builder.query<IValidateDocumentResponse, IDocumentParams>({
      query: ({ oppgaveId, dokumentId }) => `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}/validate`,
    }),
    mergedDocumentsReference: builder.query<IMergedDocumentsResponse, IShownArchivedDocument[]>({
      query: (body) => ({
        url: '/kabal-api/journalposter/mergedocuments',
        method: 'POST',
        body,
      }),
    }),
    getSmartDocumentVersions: builder.query<ISmartDocumentVersion[], IDocumentParams>({
      query: ({ oppgaveId, dokumentId }) =>
        `/kabal-api/behandlinger/${oppgaveId}/smartdokumenter/${dokumentId}/versions`,
    }),
    getSmartDocumentVersion: builder.query<KabalValue, IGetVersionParams>({
      query: ({ oppgaveId, dokumentId, versionId }) =>
        `/kabal-api/behandlinger/${oppgaveId}/smartdokumenter/${dokumentId}/versions/${versionId}`,
    }),
  }),
});

export const {
  useGetDocumentQuery,
  useGetDocumentsQuery,
  useLazyGetDocumentsQuery,
  useGetArkiverteDokumenterQuery,
  useLazyValidateDocumentQuery,
  useMergedDocumentsReferenceQuery,
  useLazyMergedDocumentsReferenceQuery,
  useLazyGetDocumentQuery,
  useGetSmartDocumentVersionsQuery,
  useGetSmartDocumentVersionQuery,
} = documentsQuerySlice;
