import { Select, Tooltip } from '@navikt/ds-react';
import { useDistribusjonstypeOptions } from '@/hooks/use-distribusjonstype-options';
import { type DistribusjonsType, DocumentTypeEnum } from '@/types/documents/documents';

const NONE = 'NONE';
const NONE_OPTION = <option value={NONE}>Velg dokumenttype</option>;

interface DocumentTypeProps {
  setDistributionType: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  distributionType: DistribusjonsType | null;
}

export const SetDistributionType = ({ distributionType, setDistributionType }: DocumentTypeProps) => {
  const { options } = useDistribusjonstypeOptions(DocumentTypeEnum.UPLOADED);

  return (
    <Tooltip content="Velg dokumenttype for opplasting av dokumenter">
      <Select
        onChange={setDistributionType}
        label="Dokumenttype"
        value={distributionType ?? NONE}
        hideLabel
        size="small"
      >
        {distributionType === null ? NONE_OPTION : null}
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </Tooltip>
  );
};
