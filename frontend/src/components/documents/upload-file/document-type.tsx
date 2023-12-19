import { Select } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { styled } from 'styled-components';
import { useDistribusjonstypeOptions } from '@app/hooks/use-distribusjonstype-options';
import { DistribusjonsType, DocumentTypeEnum } from '@app/types/documents/documents';

interface DocumentTypeProps {
  setDokumentTypeId: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  dokumentTypeId: DistribusjonsType;
}

export const SetDocumentType = ({ dokumentTypeId, setDokumentTypeId }: DocumentTypeProps) => {
  const distribusjonstypeOptions = useDistribusjonstypeOptions(DocumentTypeEnum.UPLOADED);

  const options = useMemo(
    () =>
      distribusjonstypeOptions.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      )),
    [distribusjonstypeOptions],
  );

  return (
    <StyledSelect
      onChange={setDokumentTypeId}
      label="Dokumenttype"
      value={dokumentTypeId}
      hideLabel
      size="small"
      title="Dokumenttype for opplastet dokument"
      data-testid="upload-document-type-select"
    >
      {options}
    </StyledSelect>
  );
};

const StyledSelect = styled(Select)`
  flex-shrink: 0;
  flex-grow: 0;
  align-self: flex-start;

  select {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
