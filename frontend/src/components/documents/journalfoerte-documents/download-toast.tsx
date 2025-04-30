import { FileType } from '@app/components/documents/filetype';
import {
  type DownloadableDocument,
  downloadDocuments,
} from '@app/components/documents/journalfoerte-documents/download';
import { getId } from '@app/components/documents/journalfoerte-documents/select-context/helpers';
import { toast } from '@app/components/toast/store';
import { BodyShort, Button } from '@navikt/ds-react';

export const showDownloadDocumentsToast = (...documents: DownloadableDocument[]) => {
  if (documents.length === 0) {
    return;
  }

  if (documents.length === 1) {
    const document = documents[0];

    if (document === undefined) {
      return;
    }

    return toast.info(
      <>
        <BodyShort size="small">
          <span>Dokumentet «{document.tittel}» kunne ikke åpnes fordi det er av type </span>
          <FileType varianter={document.varianter} />
          <span>.</span>
        </BodyShort>

        <DownloadButton documents={documents} target={`«${document.tittel}»`} />
      </>,
    );
  }

  return toast.info(
    <>
      <BodyShort size="small">
        Kunne ikke åpne følgende {documents.length} dokumenter fordi de ikke er PDF-dokumenter:
      </BodyShort>

      <ul className="list-disc pl-4">
        {documents.map((document) => (
          <li key={getId(document)}>
            {document.tittel ?? document.journalpostId} <FileType varianter={document.varianter} />
          </li>
        ))}
      </ul>

      <DownloadButton documents={documents} target="dokumentene" />
    </>,
  );
};

interface DownloadButtonProps {
  documents: DownloadableDocument[];
  target: string;
}

const DownloadButton = ({ documents, target }: DownloadButtonProps) => (
  <Button size="small" onClick={() => downloadDocuments(...documents)}>
    Last ned {target}
  </Button>
);
