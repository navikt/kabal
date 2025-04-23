// import type { IArkivertDocument } from '@app/types/arkiverte-documents';
// import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
// import { useCallback } from 'react';
// import { getDocumentPath, getFirstPath, matchDocuments } from './helpers';
// import { useSelectMany } from './select-many';
// import type { SelectRangeToHook } from './types';

// export const useSelectRangeTo: SelectRangeToHook = (
//   setSelectedDocuments,
//   setLastSelectedDocument,
//   documentList,
//   lastSelectedDocument,
// ) => {
//   const selectMany = useSelectMany(setSelectedDocuments, setLastSelectedDocument, documentList);

//   return useCallback(
//     (document: IJournalfoertDokumentId) => {
//       if (lastSelectedDocument === null || matchDocuments(lastSelectedDocument, document)) {
//         return;
//       }

//       selectMany(getSelectedDocuments(documentList, lastSelectedDocument, document));
//     },
//     [documentList, lastSelectedDocument, selectMany],
//   );
// };

// const FIRST_DOCUMENT_INDEX = 0;

// const getSelectedDocuments = (
//   documentList: IArkivertDocument[],
//   lastSelectedDocument: IJournalfoertDokumentId,
//   document: IJournalfoertDokumentId,
// ): IJournalfoertDokumentId[] => {
//   const lastSelectedPath = getDocumentPath(documentList, lastSelectedDocument);
//   const selectedPath = getDocumentPath(documentList, document);

//   const firstPath = getFirstPath(lastSelectedPath, selectedPath);
//   const lastPath = firstPath === lastSelectedPath ? selectedPath : lastSelectedPath;

//   const [firstDocumentIndex, firstVedleggIndex] = firstPath;
//   const [lastDocumentIndex, lastVedleggIndex] = lastPath;
//   const lastVedleggCount = lastVedleggIndex + 1;

//   // If range is only in one document.
//   if (firstDocumentIndex === lastDocumentIndex) {
//     const onlyDocument = documentList[firstDocumentIndex];

//     if (onlyDocument === undefined) {
//       return [];
//     }

//     const { journalpostId, vedlegg } = onlyDocument;

//     // If the document itself is included.
//     if (firstVedleggIndex === -1) {
//       return [
//         document,
//         ...vedlegg
//           .slice(0, lastVedleggCount)
//           .filter((v) => v.hasAccess)
//           .map((v) => ({
//             journalpostId,
//             dokumentInfoId: v.dokumentInfoId,
//           })),
//       ];
//     }

//     // If the range only includes vedlegg.
//     return [
//       ...vedlegg
//         .slice(firstVedleggIndex, lastVedleggCount)
//         .filter((v) => v.hasAccess)
//         .map((v) => ({
//           journalpostId,
//           dokumentInfoId: v.dokumentInfoId,
//         })),
//     ];
//   }

//   // Optimization: Shorten the full list to all potentially relevant documents, including their vedlegg.
//   const optimizedDocumentList = documentList.slice(firstDocumentIndex, lastDocumentIndex + 1);

//   const optimizedLastDocumentIndex = optimizedDocumentList.length - 1;

//   return optimizedDocumentList.reduce<IJournalfoertDokumentId[]>(
//     (acc, { journalpostId, dokumentInfoId, vedlegg }, index) => {
//       // If this is the first document.
//       if (index === FIRST_DOCUMENT_INDEX) {
//         // And the document itself was selected.
//         if (firstVedleggIndex === -1) {
//           // Add the document and all of its vedlegg.
//           acc.push({ journalpostId, dokumentInfoId });
//           acc.push(
//             ...vedlegg.map((v) => ({
//               journalpostId,
//               dokumentInfoId: v.dokumentInfoId,
//             })),
//           );

//           return acc;
//         }

//         // If the document itself was not selected, add all vedlegg from the first selected vedlegg.
//         acc.push(
//           ...vedlegg.slice(firstVedleggIndex).map((v) => ({
//             journalpostId,
//             dokumentInfoId: v.dokumentInfoId,
//           })),
//         );

//         return acc;
//       }

//       // If this is the last document.
//       if (index === optimizedLastDocumentIndex) {
//         // And the document itself was selected.
//         if (lastVedleggIndex === -1) {
//           // Add the document and NONE of its vedlegg.
//           acc.push({ journalpostId, dokumentInfoId });

//           return acc;
//         }

//         // If the document itself was not selected, add all vedlegg up to the last selected vedlegg.
//         acc.push({ journalpostId, dokumentInfoId });
//         acc.push(
//           ...vedlegg.slice(0, lastVedleggCount).map((v) => ({
//             journalpostId,
//             dokumentInfoId: v.dokumentInfoId,
//           })),
//         );

//         return acc;
//       }

//       // If this is a document in between the first and last document.
//       // Add the documents and all of its vedlegg.
//       acc.push({ journalpostId, dokumentInfoId });
//       acc.push(
//         ...vedlegg.map((v) => ({
//           journalpostId,
//           dokumentInfoId: v.dokumentInfoId,
//         })),
//       );

//       return acc;
//     },
//     [],
//   );
// };
