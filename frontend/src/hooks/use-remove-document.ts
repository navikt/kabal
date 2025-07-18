import { DocumentTypeEnum, type IDocument } from '@app/types/documents/documents';
import { useDocumentsPdfViewed, useSmartEditorActiveDocument } from './settings/use-setting';

export const useRemoveDocument = () => {
  const { value: viewedPdf, remove: removeViewedPdf } = useDocumentsPdfViewed();
  const { value: activeSmartEditor, remove: removeActiveSmartEditor } = useSmartEditorActiveDocument();

  return (smartEditorId: string, document: IDocument) => {
    if (activeSmartEditor === smartEditorId) {
      removeActiveSmartEditor();
    }

    if (viewedPdf.length === 1) {
      const [first] = viewedPdf;

      if (first !== undefined) {
        const archiveMatch =
          first.type === DocumentTypeEnum.JOURNALFOERT &&
          document.type === DocumentTypeEnum.JOURNALFOERT &&
          first.dokumentInfoId === document.journalfoertDokumentReference.dokumentInfoId &&
          first.journalpostId === document.journalfoertDokumentReference.journalpostId;

        const nonArchiveMatch =
          first.type !== DocumentTypeEnum.JOURNALFOERT &&
          document.type !== DocumentTypeEnum.JOURNALFOERT &&
          first.documentId === document.id;

        if (archiveMatch || nonArchiveMatch) {
          removeViewedPdf();
        }
      }
    }
  };
};
