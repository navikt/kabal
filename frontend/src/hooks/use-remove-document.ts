import { DocumentTypeEnum } from '@app/components/show-document/types';
import { useDocumentsPdfViewed, useSmartEditorActiveDocument } from './settings/use-setting';

export const useRemoveDocument = () => {
  const { value: viewedPdf, remove: removeViewedPdf } = useDocumentsPdfViewed();
  const { value: activeSmartEditor, remove: removeActiveSmartEditor } = useSmartEditorActiveDocument();

  return (id: string) => {
    if (activeSmartEditor === id) {
      removeActiveSmartEditor();
    }

    if (typeof viewedPdf === 'undefined' || viewedPdf.type === DocumentTypeEnum.ARCHIVED) {
      return;
    }

    if (viewedPdf.documentId === id) {
      removeViewedPdf();
    }
  };
};
