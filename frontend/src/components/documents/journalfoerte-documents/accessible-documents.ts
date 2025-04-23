import type { IArkivertDocument, IArkivertDocumentVedlegg } from '@app/types/arkiverte-documents';
import { useMemo } from 'react';

type AccessibleDocument =
  | {
      document: IArkivertDocument;
      isVedlegg: false;
      realDocumentIndex: number;
      accessibleDocumentIndex: number;
    }
  | {
      document: IArkivertDocumentVedlegg;
      isVedlegg: true;
      realDocumentIndex: number;
      accessibleDocumentIndex: number;
    };

export const useAccessibleDocuments = (filteredDocuments: IArkivertDocument[]) =>
  useMemo<AccessibleDocument[]>(() => {
    const selectable: AccessibleDocument[] = [];

    let realDocumentIndex = 0;
    let accessibleDocumentIndex = 0;

    for (const document of filteredDocuments) {
      if (document.hasAccess) {
        selectable.push({ document, isVedlegg: false, realDocumentIndex, accessibleDocumentIndex });
        accessibleDocumentIndex++;
      }
      realDocumentIndex++;

      for (const attachment of document.vedlegg) {
        if (attachment.hasAccess) {
          selectable.push({ document: attachment, isVedlegg: true, realDocumentIndex, accessibleDocumentIndex });
          accessibleDocumentIndex++;
        }
        realDocumentIndex++;
      }
    }

    return selectable;
  }, [filteredDocuments]);
