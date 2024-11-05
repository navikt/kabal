import { getId } from '@app/components/documents/journalfoerte-documents/select-context/helpers';
import type { SelectedMap } from '@app/components/documents/journalfoerte-documents/select-context/types';
import type { IShownArchivedDocument } from '@app/components/view-pdf/types';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { DocumentTypeEnum } from '@app/types/documents/documents';

export const getSelectedDocumentsInOrder = (
  selectedDocuments: SelectedMap,
  archivedDocuments: IArkivertDocument[],
  selectedCount: number,
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
): IShownArchivedDocument[] => {
  const sortedList: IShownArchivedDocument[] = [];

  for (const document of archivedDocuments) {
    {
      const selected = selectedDocuments.get(getId(document));

      if (selected !== undefined) {
        sortedList.push({
          ...selected,
          type: DocumentTypeEnum.JOURNALFOERT,
        });

        if (sortedList.length === selectedCount) {
          break;
        }
      }
    }

    for (const vedlegg of document.vedlegg) {
      const selected = selectedDocuments.get(
        getId({
          dokumentInfoId: vedlegg.dokumentInfoId,
          journalpostId: document.journalpostId,
        }),
      );

      if (selected !== undefined) {
        sortedList.push({
          ...selected,
          type: DocumentTypeEnum.JOURNALFOERT,
        });

        if (sortedList.length === selectedCount) {
          break;
        }
      }
    }

    if (sortedList.length === selectedCount) {
      break;
    }
  }

  return sortedList;
};
