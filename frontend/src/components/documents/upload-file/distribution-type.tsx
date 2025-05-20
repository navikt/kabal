import { useDistribusjonstypeOptions } from '@app/hooks/use-distribusjonstype-options';
import { type DistribusjonsType, DocumentTypeEnum } from '@app/types/documents/documents';
import { Select } from '@navikt/ds-react';
import { useMemo } from 'react';
import { styled } from 'styled-components';

const NONE = 'NONE';
const NONE_OPTION = <option value={NONE}>Velg dokumenttype</option>;

interface DocumentTypeProps {
  setDistributionType: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  distributionType: DistribusjonsType | null;
}

export const SetDistributionType = ({ distributionType, setDistributionType }: DocumentTypeProps) => {
  const { outgoing, incoming } = useDistribusjonstypeOptions(DocumentTypeEnum.UPLOADED);

  const options = useMemo<React.ReactNode[]>(
    () =>
      [...outgoing, ...incoming].map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      )),
    [outgoing, incoming],
  );

  return (
    <StyledSelect
      onChange={setDistributionType}
      label="Dokumenttype"
      value={distributionType ?? NONE}
      hideLabel
      size="small"
      title="Dokumenttype for opplastet dokument"
      data-testid="upload-document-type-select"
    >
      {distributionType === null ? NONE_OPTION : null}
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
