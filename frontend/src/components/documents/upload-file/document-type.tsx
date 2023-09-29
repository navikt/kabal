import { Select } from '@navikt/ds-react';
import React from 'react';
import { DistribusjonsType } from '@app/types/documents/documents';

interface DocumentTypeProps {
  setDokumentTypeId: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  dokumentTypeId: DistribusjonsType | null;
  error: string | undefined;
}

export const SetDocumentType = ({ dokumentTypeId, setDokumentTypeId, error }: DocumentTypeProps) => (
  <Select
    onChange={setDokumentTypeId}
    label="Dokumenttype"
    value={dokumentTypeId ?? undefined}
    hideLabel
    size="small"
    title="Dokumenttype for opplastet dokument"
    error={error}
    data-testid="upload-document-type-select"
  >
    <NoneSelected dokumentTypeId={dokumentTypeId} />
    <option value={DistribusjonsType.NOTAT}>Notat</option>
    <option value={DistribusjonsType.BREV}>Brev</option>
    <option value={DistribusjonsType.VEDTAKSBREV}>Vedtaksbrev</option>
    <option value={DistribusjonsType.BESLUTNING}>Beslutningsbrev</option>
  </Select>
);

interface NoneSelectedProps {
  dokumentTypeId: DistribusjonsType | null;
}

const NoneSelected = ({ dokumentTypeId }: NoneSelectedProps) => {
  if (dokumentTypeId !== null) {
    return null;
  }

  return <option value={undefined}>Dokumenttype</option>;
};
