import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useEffect, useState } from 'react';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useKlagebehandlingId } from '../../../hooks/use-klagebehandling-id';
import { useGetKodeverkQuery } from '../../../redux-api/kodeverk';
import { useUpdateHjemlerMutation } from '../../../redux-api/oppgave';
import { LabelLovhjemmel } from '../../../styled-components/labels';
import { MultiSelect } from '../../multi-select/multi-select';
import { StyledLovhjemmelLabel, StyledLovhjemmelLabels } from '../styled-components';
import { SubSection } from './sub-section';

interface HjemmelProps {
  hjemler: string[];
}

export const Lovhjemmel = ({ hjemler }: HjemmelProps) => {
  const [updateHjemler] = useUpdateHjemlerMutation();
  const klagebehandlingId = useKlagebehandlingId();
  const canEdit = useCanEdit(klagebehandlingId);

  const { data: kodeverk, isLoading } = useGetKodeverkQuery();
  const [localHjemler, setLocalHjemler] = useState<string[]>(hjemler);

  useEffect(() => {
    setLocalHjemler(hjemler);
  }, [hjemler, setLocalHjemler]);

  if (typeof kodeverk === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const selected = localHjemler.map((hjemmelId) => ({
    label: kodeverk.hjemmel.find(({ id }) => id === hjemmelId)?.navn ?? hjemmelId,
    value: hjemmelId,
  }));

  const children = selected.map(({ label, value }) => (
    <StyledLovhjemmelLabel key={value}>
      <LabelLovhjemmel>{label}</LabelLovhjemmel>
    </StyledLovhjemmelLabel>
  ));

  const title = <StyledLovhjemmelLabels>{children}</StyledLovhjemmelLabels>;

  const onLovhjemmelChange = (value: string[]) => {
    setLocalHjemler(value);
    updateHjemler({ klagebehandlingId, hjemler: value });
  };

  return (
    <SubSection label="Utfallet er basert på lovhjemmel">
      <MultiSelect
        disabled={!canEdit}
        options={kodeverk.hjemmel}
        title={title}
        selected={localHjemler}
        onChange={onLovhjemmelChange}
      />
    </SubSection>
  );
};
