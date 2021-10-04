import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useEffect, useState } from 'react';
import { useGetKodeverkQuery } from '../../../redux-api/kodeverk';
import { IKlagebehandlingUpdate } from '../../../redux-api/oppgave-types';
import { LabelLovhjemmel } from '../../../styled-components/labels';
import { MultiSelect } from '../../multi-select/multi-select';
import { StyledLovhjemmelLabel, StyledLovhjemmelLabels } from '../styled-components';

interface HjemmelProps {
  onChange: (klagebehandlingUpdate: Partial<IKlagebehandlingUpdate>) => void;
  hjemler: string[];
}

export const Lovhjemmel = ({ onChange, hjemler }: HjemmelProps) => {
  const { data: kodeverk, isLoading } = useGetKodeverkQuery();
  const [localHjemler, setLocalHjemler] = useState<string[]>(hjemler);

  useEffect(() => {
    setLocalHjemler(hjemler);
  }, [hjemler, setLocalHjemler]);

  if (typeof kodeverk === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const options = kodeverk.hjemmel.map(({ id, navn }) => ({ value: id, label: navn }));
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
    onChange({ hjemler: value });
  };

  return (
    <MultiSelect options={options} title={title} selected={localHjemler} onChange={onLovhjemmelChange}></MultiSelect>
  );
};
