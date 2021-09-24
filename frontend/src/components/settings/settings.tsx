import React, { useState } from 'react';
import styled from 'styled-components';
import { useGetKodeverkQuery } from '../../redux-api/kodeverk';
import { EtikettTema, EtikettMain } from '../../styled-components/Etiketter';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';
import { useFullTemaNameFromId, useHjemmelFromId, useTypeFromId } from '../../hooks/useKodeverkIds';
import { ISettings, useUpdateSettingsMutation } from '../../redux-api/bruker';
import { useGetBrukerQuery } from '../../redux-api/bruker';

const EMPTY_SETTINGS: ISettings = {
  typer: [],
  temaer: [],
  hjemler: [],
};

export const Settings = () => {
  const { data: kodeverk } = useGetKodeverkQuery();
  const { data: userData } = useGetBrukerQuery();
  const [updateSettings] = useUpdateSettingsMutation();

  const onChange = (settings: ISettings) => {
    if (typeof userData === 'undefined') {
      return;
    }
    const navIdent = userData.info.navIdent;
    updateSettings({ navIdent, ...settings });
    setCurrentSettings(settings);
  };

  const [currentSettings, setCurrentSettings] = useState<ISettings>(userData?.innstillinger ?? EMPTY_SETTINGS);

  return (
    <>
      <p>Velg hvilke ytelser og hjemmeler du har kompetanse til å behandle:</p>
      <StyledFilters>
        <FilterDropdown
          selected={currentSettings.typer}
          onChange={(typer) => onChange({ ...currentSettings, typer })}
          options={kodeverk?.type ?? []}
        >
          Type
        </FilterDropdown>
        <FilterDropdown
          selected={currentSettings.temaer}
          onChange={(temaer) => onChange({ ...currentSettings, temaer })}
          options={kodeverk?.tema ?? []}
        >
          Tema
        </FilterDropdown>
        <FilterDropdown
          selected={currentSettings.hjemler}
          onChange={(hjemler) => onChange({ ...currentSettings, hjemler })}
          options={kodeverk?.hjemmel ?? []}
        >
          Hjemmel
        </FilterDropdown>
      </StyledFilters>
      <StyledFilters>
        <ChosenFilters settings={currentSettings} />
      </StyledFilters>
    </>
  );
};

interface ChosenTemaerProps {
  settings: ISettings;
}

const ChosenFilters = ({ settings }: ChosenTemaerProps) => (
  <>
    <StyledFiltersDisplay>
      {settings.typer.map((typeId) => (
        <TypeEtikett key={typeId} id={typeId} />
      ))}
    </StyledFiltersDisplay>
    <StyledFiltersDisplay>
      {settings.temaer.map((temaId) => (
        <TemaEtikett key={temaId} id={temaId} />
      ))}
    </StyledFiltersDisplay>
    <StyledFiltersDisplay>
      {settings.hjemler.map((hjemmelId) => (
        <HjemmelEtikett key={hjemmelId} id={hjemmelId} />
      ))}
    </StyledFiltersDisplay>
  </>
);

interface EtikettProps {
  id: string;
}

const TypeEtikett = ({ id }: EtikettProps) => <EtikettMain>{useTypeFromId(id)}</EtikettMain>;

const TemaEtikett = ({ id }: EtikettProps) => <EtikettTema tema={id}>{useFullTemaNameFromId(id)}</EtikettTema>;

const HjemmelEtikett = ({ id }: EtikettProps) => <EtikettMain>{useHjemmelFromId(id)}</EtikettMain>;

const StyledFilters = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 20px;
  > * {
    width: 150px;
    margin-right: 20px;
    button {
      width: 100%;
    }
  }
`;

const StyledFiltersDisplay = styled.div`
  display: flex;
  flex-direction: column;
  > * {
    margin-bottom: 20px;
    button {
      width: 100%;
    }
  }
`;
