import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { MultipleChoiceHeader } from '../../komponenter/Klagebehandling/Behandlingsdetaljer/Kvalitetsskjema/MultipleChoiceHeader';
import { useGetKodeverkQuery } from '../../redux-api/kodeverk';
import { IKlagebehandlingUpdate } from '../../redux-api/oppgave-types';
import { LabelLovhjemmel } from '../../styled-components/labels';
import { Filter } from '../../tilstand/moduler/oppgave';
import { StyledLabelLovhjemmel } from './styled-components';

interface HjemmelProps {
  onChange: (klagebehandlingUpdate: Partial<IKlagebehandlingUpdate>) => void;
  hjemler: string[];
}

export const Lovhjemmel = ({ onChange, hjemler }: HjemmelProps) => {
  const { data: kodeverk, isLoading } = useGetKodeverkQuery();

  if (typeof kodeverk === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const options = kodeverk.hjemmel.map(({ id, navn }) => ({ value: id, label: navn }));
  const selected = hjemler.map((hjemmelId) => ({
    label: kodeverk.hjemmel.find(({ id }) => id === hjemmelId)?.navn ?? hjemmelId,
    value: hjemmelId,
  }));

  const onSelect = (filter: Filter[]) => {
    const data = filter.filter(({ value }) => value !== undefined).map(({ value }) => value);

    onChange({ hjemler: data } as IKlagebehandlingUpdate);
  };

  const children = selected.map(({ label, value }) => (
    <StyledLabelLovhjemmel key={value}>
      <LabelLovhjemmel>{label}</LabelLovhjemmel>
    </StyledLabelLovhjemmel>
  ));

  return (
    <MultipleChoiceHeader
      onSelect={onSelect}
      valgmuligheter={options}
      defaultValgte={selected}
      label="Utfallet er basert på lovhjemmel:"
    >
      {children}
    </MultipleChoiceHeader>
  );
};
