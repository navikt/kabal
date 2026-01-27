import { DocumentTypeEnum, type IDocument } from '@app/types/documents/documents';
import { useFilesViewed, useSmartEditorActiveDocument } from './settings/use-setting';

export const useRemoveDocument = () => {
  const { value: pdfViewed, remove: removeViewedPdf } = useFilesViewed();
  const { value: activeSmartEditor, remove: removeActiveSmartEditor } = useSmartEditorActiveDocument();

  return (smartEditorId: string, document: IDocument) => {
    if (activeSmartEditor === smartEditorId) {
      removeActiveSmartEditor();
    }

    if (document.type === DocumentTypeEnum.JOURNALFOERT) {
      const isViewed =
        pdfViewed.archivedFiles?.length === 1 &&
        pdfViewed.archivedFiles[0]?.dokumentInfoId === document.journalfoertDokumentReference.dokumentInfoId &&
        pdfViewed.archivedFiles[0]?.journalpostId === document.journalfoertDokumentReference.journalpostId;

      if (isViewed) {
        removeViewedPdf();
      }
    } else {
      const isViewed = pdfViewed.newDocument === document.id || pdfViewed.vedleggsoversikt === document.id;

      if (isViewed) {
        removeViewedPdf();
      }
    }
  };
};
