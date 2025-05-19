import { getSaveId, getSaveSuccessId } from '@app/components/smart-editor/tabbed-editors/use-save-document/ids';
import type { IShownNewDocument } from '@app/components/view-pdf/types';
import { useShownDocuments } from '@app/hooks/use-shown-documents';
import { pushEvent } from '@app/observability';
import { DocumentTypeEnum } from '@app/types/documents/documents';

export const useFixSmartDocuments = () => {
  const { showDocumentList } = useShownDocuments();
  const smartDocs = showDocumentList.filter((d): d is IShownNewDocument => d.type === DocumentTypeEnum.SMART);

  if (smartDocs.length === 0) {
    return;
  }

  return async () => {
    const promises = smartDocs.map(
      ({ documentId }) =>
        new Promise<void>((resolve) => {
          window.addEventListener(
            getSaveSuccessId(documentId),
            () => {
              resolve();
            },
            { once: true },
          );
        }),
    );

    for (const { documentId } of smartDocs) {
      window.dispatchEvent(new CustomEvent(getSaveId(documentId)));
      pushEvent('fix-smart-document', 'view-pdf', { documentId });
    }

    await Promise.all(promises);
  };
};
