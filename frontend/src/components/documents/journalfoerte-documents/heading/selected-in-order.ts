import { canOpenInKabal } from '@app/components/documents/filetype';
import { getId } from '@app/components/documents/journalfoerte-documents/select-context/helpers';
import type { SelectedMap } from '@app/components/documents/journalfoerte-documents/select-context/types';
import type { IArkivertDocument, Variants } from '@app/types/arkiverte-documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';

interface DownloadableDocument extends IJournalfoertDokumentId {
  tittel: string;
  varianter: Variants;
}

interface Result {
  toOpen: IJournalfoertDokumentId[];
  toDownload: DownloadableDocument[];
}

export const getSelectedDocumentsInOrder = (
  selectedDocuments: SelectedMap,
  archivedDocuments: IArkivertDocument[],
): Result => {
  const toOpen: IJournalfoertDokumentId[] = [];
  const toDownload: DownloadableDocument[] = [];

  interface ToAdd {
    journalpostId: string;
    dokumentInfoId: string;
    tittel: string | null;
    varianter: Variants;
  }

  const addDocument = ({ varianter, tittel, ...ids }: ToAdd): boolean => {
    if (!selectedDocuments.has(getId(ids))) {
      return false;
    }

    if (canOpenInKabal(varianter)) {
      toOpen.push(ids);
    } else {
      toDownload.push({ ...ids, tittel: tittel ?? ids.journalpostId, varianter });
    }

    return toOpen.length + toDownload.length === selectedDocuments.size;
  };

  for (const { journalpostId, dokumentInfoId, varianter, tittel, vedlegg } of archivedDocuments) {
    if (addDocument({ varianter, tittel, journalpostId, dokumentInfoId })) {
      return { toOpen, toDownload };
    }

    for (const { dokumentInfoId, varianter, tittel } of vedlegg) {
      if (addDocument({ journalpostId, dokumentInfoId, varianter, tittel })) {
        return { toOpen, toDownload };
      }
    }
  }

  return { toOpen, toDownload };
};
