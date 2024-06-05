import { Select } from '@navikt/ds-react';
import { useMemo } from 'react';
import { styled } from 'styled-components';
import { useDistribusjonstypeOptions } from '@app/hooks/use-distribusjonstype-options';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { DistribusjonsType, DocumentTypeEnum } from '@app/types/documents/documents';

const NONE = 'NONE';
const NONE_OPTION = <option value={NONE}>Velg dokumenttype</option>;

interface DocumentTypeProps {
  setDokumentTypeId: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  dokumentTypeId: DistribusjonsType | null;
}

export const SetDocumentType = ({ dokumentTypeId, setDokumentTypeId }: DocumentTypeProps) => {
  const { outgoing, incoming } = useDistribusjonstypeOptions(DocumentTypeEnum.UPLOADED);
  const isSaksbehandler = useIsSaksbehandler();

  const options = useMemo<React.ReactNode[]>(() => {
    const _options = isSaksbehandler ? [...outgoing, ...incoming] : incoming;

    return _options.map(({ label, value }) => (
      <option key={value} value={value}>
        {label}
      </option>
    ));
  }, [isSaksbehandler, outgoing, incoming]);

  return (
    <StyledSelect
      onChange={setDokumentTypeId}
      label="Dokumenttype"
      value={dokumentTypeId ?? NONE}
      hideLabel
      size="small"
      title="Dokumenttype for opplastet dokument"
      data-testid="upload-document-type-select"
    >
      {dokumentTypeId === null ? NONE_OPTION : null}
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
