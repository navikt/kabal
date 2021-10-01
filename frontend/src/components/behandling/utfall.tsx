import { Select } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useGetKodeverkQuery } from '../../redux-api/kodeverk';
import { IKlagebehandlingUpdate } from '../../redux-api/oppgave-types';
import { StyledUtfallResultat } from './styled-components';

interface UtfallResultatProps {
  onChange: (klagebehandlingUpdate: Partial<IKlagebehandlingUpdate>) => void;
  utfall: string | null;
}

export const UtfallResultat = ({ onChange, utfall }: UtfallResultatProps) => {
  const { data: kodeverk, isLoading } = useGetKodeverkQuery();

  const onUtfallResultatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ utfall: event.target.value });
  };

  if (typeof kodeverk === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const options = kodeverk.utfall.map(({ id, navn }) => (
    <option key={id} value={id}>
      {navn}
    </option>
  ));

  const selected = utfall === null ? undefined : utfall;

  return (
    <StyledUtfallResultat>
      <Select label="Utfall/resultat:" bredde="s" onChange={onUtfallResultatChange} selected={selected}>
        {options}
      </Select>
    </StyledUtfallResultat>
  );
};
