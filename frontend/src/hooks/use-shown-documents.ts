import { useMemo } from 'react';
import { IShownDocument } from '@app/components/view-pdf/types';
import { useGetDocumentsQuery, useGetJournalpostIdListQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum, IJournalpostReference, IMainDocument } from '@app/types/documents/documents';
import { useOppgaveId } from './oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed } from './settings/use-setting';

interface ShowDocumentResult {
  showDocumentList: IShownDocument[];
  title: string | null;
}

const EMPTY_SHOWN_LIST: IShownDocument[] = [];
const EMPTY_MAIN_LIST: IMainDocument[] = [];
const EMPTY_ARCHIVED_LIST: IJournalpostReference[] = [];

// export const useShownDocuments = (): ShowDocumentResult => {
// const oppgaveId = useOppgaveId();
// const { value: showDocumentList = EMPTY_SHOWN_LIST } = useDocumentsPdfViewed();
// const { data: documentsInProgress = EMPTY_MAIN_LIST } = useGetDocumentsQuery(oppgaveId);
// const { data: journalposter } = useGetJournalpostIdListQuery(oppgaveId);

// const journalpostDocuments = journalposter?.journalpostList ?? EMPTY_ARCHIVED_LIST;

// const title = useMemo(() => {
//   if (showDocumentList.length !== 1) {
//     return null;
//   }

//   const [onlyDocument] = showDocumentList;

//   if (onlyDocument === undefined) {
//     return null;
//   }

//   if (onlyDocument.type === DocumentTypeEnum.JOURNALFOERT) {
//     for (const jp of journalpostDocuments) {
//       if (jp.journalpostId === onlyDocument.journalpostId) {
//         if (jp.dokumentInfoId === onlyDocument.dokumentInfoId) {
//           return jp.tittel;
//         }

//         return jp.vedlegg.find((v) => v === onlyDocument.dokumentInfoId)?.tittel ?? null;
//       }
//     }
//   }

//   if (onlyDocument.type === DocumentTypeEnum.SMART || onlyDocument.type === DocumentTypeEnum.UPLOADED) {
//     for (const doc of documentsInProgress) {
//       if (doc.id === onlyDocument.documentId) {
//         return doc.tittel;
//       }
//     }
//   }

//   return null;
// }, [documentsInProgress, journalpostDocuments, showDocumentList]);

//   return { showDocumentList };
// };
