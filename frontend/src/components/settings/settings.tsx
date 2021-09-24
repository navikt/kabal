import React, { useState } from 'react';
import styled from 'styled-components';
import { useGetKodeverkQuery } from '../../redux-api/kodeverk';
import { EtikettTema, EtikettMain } from '../../styled-components/Etiketter';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';
import { ISettings } from './types';
import { useFullTemaNameFromId, useHjemmelFromId, useTypeFromId } from '../../hooks/useKodeverkIds';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../../redux-api/settings';
import { useGetBrukerQuery } from '../../redux-api/bruker';

export const Settings = () => {
  const { data } = useGetKodeverkQuery();
  const { data: bruker } = useGetBrukerQuery();
  const [updateSettings, loader] = useUpdateSettingsMutation();

  const emptySettings: ISettings = {
    types: [],
    tema: [],
    hjemler: [],
  };

  let navIdent = '';
  if (typeof bruker !== undefined) {
    navIdent = bruker ? bruker.onPremisesSamAccountName : '';
  }

  const { data: settings } = useGetSettingsQuery(navIdent, { skip: navIdent === '' });

  const onChange = (settings: ISettings) => {
    updateSettings({ navIdent, ...settings });
    setCurrentSettings(settings);
  };

  const getSettings = (): ISettings => {
    if (typeof settings !== 'undefined') {
      return settings;
    }
    return emptySettings;
  };
  const [currentSettings, setCurrentSettings] = useState<ISettings>(getSettings());

  return (
    <>
      <p>Velg hvilke ytelser og hjemmeler du har kompetanse til å behandle:</p>
      <SCFilters>
        <FilterDropdown
          selected={currentSettings.types}
          onChange={(types) => onChange({ ...currentSettings, types })}
          options={data?.type ?? []}
        >
          Type
        </FilterDropdown>
        <FilterDropdown
          selected={currentSettings.tema}
          onChange={(tema) => onChange({ ...currentSettings, tema })}
          options={data?.tema ?? []}
        >
          Tema
        </FilterDropdown>
        <FilterDropdown
          selected={currentSettings.hjemler}
          onChange={(hjemler) => onChange({ ...currentSettings, hjemler })}
          options={data?.hjemmel ?? []}
        >
          Hjemmel
        </FilterDropdown>
      </SCFilters>
      <SCFilters>
        <ChosenFilters settings={currentSettings} />
      </SCFilters>
    </>
  );
};

interface ChosenTemaerProps {
  settings: ISettings;
}

const ChosenFilters = ({ settings }: ChosenTemaerProps) => (
  <>
    <SCFiltersDisplay>
      {settings.types.map((typeId) => (
        <TypeEtikett key={typeId} id={typeId} />
      ))}
    </SCFiltersDisplay>
    <SCFiltersDisplay>
      {settings.tema.map((temaId) => (
        <TemaEtikett key={temaId} id={temaId} />
      ))}
    </SCFiltersDisplay>
    <SCFiltersDisplay>
      {settings.hjemler.map((hjemmelId) => (
        <HjemmelEtikett key={hjemmelId} id={hjemmelId} />
      ))}
    </SCFiltersDisplay>
  </>
);

interface EtikettProps {
  id: string;
}

const TypeEtikett = ({ id }: EtikettProps) => <EtikettMain>{useTypeFromId(id)}</EtikettMain>;

const TemaEtikett = ({ id }: EtikettProps) => <EtikettTema tema={id}>{useFullTemaNameFromId(id)}</EtikettTema>;

const HjemmelEtikett = ({ id }: EtikettProps) => <EtikettMain>{useHjemmelFromId(id)}</EtikettMain>;

// const Loader = (isLoading: boolean) => {
//   if (isLoading) {
//     return <NavFrontendSpinner />;
//   }
//   return null;
// };

const SCFilters = styled.div`
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

const SCFiltersDisplay = styled.div`
  display: flex;
  flex-direction: column;
  > * {
    margin-bottom: 20px;
    button {
      width: 100%;
    }
  }
`;
