import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { IShownArchivedDocument } from '@app/components/view-pdf/types';
import { ELEMENT_LABEL_CONTENT } from '@app/plate/plugins/element-types';
import { TextAlign } from '@app/plate/types';
import { IArkiverteDocumentsResponse } from '@app/types/arkiverte-documents';
import { IDocumentParams } from '@app/types/documents/common-params';
import { IMainDocument, IMergedDocumentsResponse, ISmartDocument } from '@app/types/documents/documents';
import { IValidateDocumentResponse } from '@app/types/documents/validation';
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
          type: ELEMENT_PARAGRAPH,
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
        url: `/kabal-api/journalposter/mergedocuments`,
        method: 'POST',
        body,
      }),
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
  useLazyGetDocumentQuery,
} = documentsQuerySlice;
