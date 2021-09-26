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
    <article>
      <h1>Velg hvilke ytelser og hjemmeler du har kompetanse til å behandle</h1>
      <StyledContent>
        <StyledSettingsSection>
          <FilterDropdown
            selected={settings.typer}
            onChange={(typer) => onChange({ ...settings, typer })}
            options={kodeverk?.type ?? []}
          >
            Type
          </FilterDropdown>
          <StyledFiltersList>
            {settings.typer.map((typeId) => (
              <StyledFiltersListItem key={typeId}>
                <TypeEtikett id={typeId} />
              </StyledFiltersListItem>
            ))}
          </StyledFiltersList>
        </StyledSettingsSection>
        <StyledSettingsSection>
          <FilterDropdown
            selected={settings.temaer}
            onChange={(temaer) => onChange({ ...settings, temaer })}
            options={availableTemaer}
          >
            Tema
          </FilterDropdown>
          <StyledFiltersList>
            {settings.temaer.map((temaId) => (
              <StyledFiltersListItem key={temaId}>
                <TemaEtikett id={temaId} />
              </StyledFiltersListItem>
            ))}
          </StyledFiltersList>
        </StyledSettingsSection>
        <StyledSettingsSection>
          <FilterDropdown
            selected={settings.hjemler}
            onChange={(hjemler) => onChange({ ...settings, hjemler })}
            options={kodeverk?.hjemmel ?? []}
          >
            Hjemmel
          </FilterDropdown>
          <StyledFiltersList>
            {settings.hjemler.map((hjemmelId) => (
              <StyledFiltersListItem key={hjemmelId}>
                <HjemmelEtikett id={hjemmelId} />
              </StyledFiltersListItem>
            ))}
          </StyledFiltersList>
        </StyledSettingsSection>
      </StyledContent>
    </article>
  );
};

interface EtikettProps {
  id: string;
}

const TypeEtikett = ({ id }: EtikettProps) => <EtikettMain>{useTypeFromId(id)}</EtikettMain>;

const TemaEtikett = ({ id }: EtikettProps) => <EtikettTema tema={id}>{useFullTemaNameFromId(id)}</EtikettTema>;

const HjemmelEtikett = ({ id }: EtikettProps) => <EtikettMain>{useHjemmelFromId(id)}</EtikettMain>;

const StyledContent = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 20px;
`;

const StyledSettingsSection = styled.section`
  margin-right: 20px;
`;

const StyledFiltersList = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  margin-top: 20px;
  margin-right: 20px;
  list-style: none;
  width: 100%;
`;

const StyledFiltersListItem = styled.li`
  width: 100%;
  margin-bottom: 20px;
`;
