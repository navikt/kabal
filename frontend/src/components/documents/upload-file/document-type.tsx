import { Select } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { styled } from 'styled-components';
import { OPTIONS_MAP } from '@app/components/documents/new-documents/modal/set-type/options';
import { useDistribusjonstypeOptions } from '@app/hooks/use-distribusjonstype-options';
import { useHasRole } from '@app/hooks/use-has-role';
import { Role } from '@app/types/bruker';
import { DistribusjonsType, DocumentTypeEnum } from '@app/types/documents/documents';

interface DocumentTypeProps {
  setDokumentTypeId: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  dokumentTypeId: DistribusjonsType;
}

const useOptions = () => {
  const distribusjonstypeOptions = useDistribusjonstypeOptions(DocumentTypeEnum.UPLOADED);

  const hasSaksbehandlerRole = useHasRole(Role.KABAL_SAKSBEHANDLING);
  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);

  return useMemo<React.ReactNode[]>(() => {
    if (hasSaksbehandlerRole) {
      return distribusjonstypeOptions.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ));
    }

    if (hasOppgavestyringRole) {
      return [
        <option value={DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN} key={DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN}>
          {OPTIONS_MAP[DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN]}
        </option>,
      ];
    }

    return [];
  }, [distribusjonstypeOptions, hasOppgavestyringRole, hasSaksbehandlerRole]);
};

export const SetDocumentType = ({ dokumentTypeId, setDokumentTypeId }: DocumentTypeProps) => {
  const options = useOptions();

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
