import { Select } from '@navikt/ds-react';
import React from 'react';
import { DocumentType } from '@app/types/documents/documents';

interface DocumentTypeProps {
  setDokumentTypeId: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  dokumentTypeId: DocumentType | null;
  error: string | undefined;
}

export const SetDocumentType = ({ dokumentTypeId, setDokumentTypeId, error }: DocumentTypeProps) => (
  <Select
    onChange={setDokumentTypeId}
    label="Dokumenttype"
    value={dokumentTypeId === null ? undefined : dokumentTypeId.toString()}
    hideLabel
    size="small"
    title="Dokumenttype for opplastet dokument"
    error={error}
    data-testid="upload-document-type-select"
  >
    <NoneSelected dokumentTypeId={dokumentTypeId} />
    <option value={DocumentType.NOTAT.toString()}>Notat</option>
    <option value={DocumentType.BREV.toString()}>Brev</option>
    <option value={DocumentType.VEDTAKSBREV.toString()}>Vedtaksbrev</option>
    <option value={DocumentType.BESLUTNING.toString()}>Beslutningsbrev</option>
  </Select>
);

interface NoneSelectedProps {
  dokumentTypeId: DocumentType | null;
}

const NoneSelected = ({ dokumentTypeId }: NoneSelectedProps) => {
  if (dokumentTypeId !== null) {
    return null;
  }

  return <option value={undefined}>Velg dokumenttype</option>;
};
