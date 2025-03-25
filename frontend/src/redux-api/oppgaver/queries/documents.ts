import type { IShownArchivedDocument } from '@app/components/view-pdf/types';
import { ELEMENT_LABEL_CONTENT } from '@app/plate/plugins/element-types';
import { type KabalValue, TextAlign } from '@app/plate/types';
import type { IArkiverteDocumentsResponse } from '@app/types/arkiverte-documents';
import type { IDocumentParams } from '@app/types/documents/common-params';
import type {
  IMainDocument,
  IMergedDocumentsResponse,
  ISmartDocument,
  ISmartDocumentVersion,
} from '@app/types/documents/documents';
import type { IGetVersionParams } from '@app/types/documents/params';
import type { IValidateDocumentResponse } from '@app/types/documents/validation';
import { BaseParagraphPlugin } from '@udecode/plate-core';
import { IS_LOCALHOST } from '../../common';
import { ListTagTypes } from '../../tag-types';
import { DokumenterListTagTypes, oppgaverApi } from '../oppgaver';

const dokumenterListTags = (type: DokumenterListTagTypes) => (result: IArkiverteDocumentsResponse | undefined) =>
  typeof result === 'undefined'
    ? [{ type, id: ListTagTypes.PARTIAL_LIST }]
    : result.dokumenter
        .map(({ journalpostId, dokumentInfoId }) => ({ id: `${journalpostId}-${dokumentInfoId}`, type }))
        .concat({ type, id: ListTagTypes.PARTIAL_LIST });

// TODO: Remove this when we are sure that there are no documents in progress that was created before 13.10.2023.
const transformResponse = (document: IMainDocument): IMainDocument => {
  if (!document.isSmartDokument) {
    return document;
  }

  const smartDocument: ISmartDocument = {
    ...document,
    content: document.content.map((content) => {
      if (content.type === ELEMENT_LABEL_CONTENT) {
        return {
          type: BaseParagraphPlugin.key,
          align: TextAlign.LEFT,
          children: [{ text: '' }, content, { text: '' }],
        };
      }

      return content;
    }),
  };

  return smartDocument;
};

export const documentsQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getDocument: builder.query<IMainDocument, IDocumentParams>({
      query: ({ oppgaveId, dokumentId }) => `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}`,
      transformResponse,
    }),
    getDocuments: builder.query<IMainDocument[], string>({
      query: (oppgaveId) => `/kabal-api/behandlinger/${oppgaveId}/dokumenter`,
      transformResponse: (documents: IMainDocument[]) => documents.map(transformResponse),
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
