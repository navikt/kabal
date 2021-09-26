import React from 'react';
import styled from 'styled-components';
import { useGetKodeverkQuery } from '../../redux-api/kodeverk';
import { EtikettTema, EtikettMain } from '../../styled-components/Etiketter';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';
import { useFullTemaNameFromId, useHjemmelFromId, useTypeFromId } from '../../hooks/useKodeverkIds';
import { ISettings, useUpdateSettingsMutation } from '../../redux-api/bruker';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { useAvailableTemaer } from '../../hooks/use-available-temaer';

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
  };

  const settings = userData?.innstillinger ?? EMPTY_SETTINGS;

  const availableTemaer = useAvailableTemaer();

  return (
    <>
      <p>Velg hvilke ytelser og hjemmeler du har kompetanse til å behandle:</p>
      <StyledSettingsRow>
        <FilterDropdown
          selected={settings.typer}
          onChange={(typer) => onChange({ ...settings, typer })}
          options={kodeverk?.type ?? []}
        >
          Type
        </FilterDropdown>
        <FilterDropdown
          selected={settings.temaer}
          onChange={(temaer) => onChange({ ...settings, temaer })}
          options={availableTemaer}
        >
          Tema
        </FilterDropdown>
        <FilterDropdown
          selected={settings.hjemler}
          onChange={(hjemler) => onChange({ ...settings, hjemler })}
          options={kodeverk?.hjemmel ?? []}
        >
          Hjemmel
        </FilterDropdown>
      </StyledSettingsRow>
      <StyledSettingsRow>
        <ChosenFilters settings={settings} />
      </StyledSettingsRow>
    </>
  );
};

interface ChosenTemaerProps {
  settings: ISettings;
}

const ChosenFilters = ({ settings }: ChosenTemaerProps) => (
  <>
    <StyledFiltersList>
      {settings.typer.map((typeId) => (
        <StyledFiltersListItem key={typeId}>
          <TypeEtikett id={typeId} />
        </StyledFiltersListItem>
      ))}
    </StyledFiltersList>
    <StyledFiltersList>
      {settings.temaer.map((temaId) => (
        <StyledFiltersListItem key={temaId}>
          <TemaEtikett id={temaId} />
        </StyledFiltersListItem>
      ))}
    </StyledFiltersList>
    <StyledFiltersList>
      {settings.hjemler.map((hjemmelId) => (
        <StyledFiltersListItem key={hjemmelId}>
          <HjemmelEtikett id={hjemmelId} />
        </StyledFiltersListItem>
      ))}
    </StyledFiltersList>
  </>
);

interface EtikettProps {
  id: string;
}

const TypeEtikett = ({ id }: EtikettProps) => <EtikettMain>{useTypeFromId(id)}</EtikettMain>;

const TemaEtikett = ({ id }: EtikettProps) => <EtikettTema tema={id}>{useFullTemaNameFromId(id)}</EtikettTema>;

const HjemmelEtikett = ({ id }: EtikettProps) => <EtikettMain>{useHjemmelFromId(id)}</EtikettMain>;

const StyledSettingsRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const StyledFiltersList = styled.ul`
  display: flex;
  flex-direction: column;
`;

const StyledFiltersListItem = styled.li`
  margin-bottom: 20px;
`;
