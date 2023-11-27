import { Select } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { DistribusjonsType } from '@app/types/documents/documents';

interface DocumentTypeProps {
  setDokumentTypeId: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  dokumentTypeId: DistribusjonsType;
}

export const SetDocumentType = ({ dokumentTypeId, setDokumentTypeId }: DocumentTypeProps) => (
  <StyledSelect
    onChange={setDokumentTypeId}
    label="Dokumenttype"
    value={dokumentTypeId}
    hideLabel
    size="small"
    title="Dokumenttype for opplastet dokument"
    data-testid="upload-document-type-select"
  >
    <option value={DistribusjonsType.NOTAT}>Notat</option>
    <option value={DistribusjonsType.BREV}>Brev</option>
    <option value={DistribusjonsType.VEDTAKSBREV}>Vedtaksbrev</option>
    <option value={DistribusjonsType.BESLUTNING}>Beslutningsbrev</option>
  </StyledSelect>
);

const StyledSelect = styled(Select)`
  flex-shrink: 0;
  flex-grow: 0;
  align-self: flex-start;
`;
