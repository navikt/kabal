import React from 'react';
import styled from 'styled-components';
import { useAvailableYtelser } from '../../hooks/use-available-ytelser';
import { useFullYtelseNameFromId, useHjemmelFromId, useTypeNameFromId } from '../../hooks/use-kodeverk-ids';
import { ISettings, useGetSettingsQuery, useUpdateSettingsMutation } from '../../redux-api/bruker';
import { useGetKodeverkQuery } from '../../redux-api/kodeverk';
import { LabelMain, LabelTema } from '../../styled-components/labels';
import { OppgaveType } from '../../types/kodeverk';
import { kodeverkSimpleValuesToDropdownOptions, kodeverkValuesToDropdownOptions } from '../dropdown/dropdown';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';
import { SectionHeader, SettingsSection } from './styled-components';

const EMPTY_SETTINGS: ISettings = {
  typer: [],
  ytelser: [],
  hjemler: [],
};

export const Filters = () => {
  const { data: kodeverk } = useGetKodeverkQuery();
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation();
  const { data: settingsData } = useGetSettingsQuery();

  const onChange = (settings: ISettings) => {
    if (isLoading) {
      return;
    }

    updateSettings(settings);
  };

  const settings = settingsData ?? EMPTY_SETTINGS;

  const availableYtelser = useAvailableYtelser();

  if (typeof kodeverk === 'undefined') {
    return null;
  }

  return (
    <SettingsSection>
      <SectionHeader>Velg hvilke ytelser og hjemler du har kompetanse til å behandle</SectionHeader>

      <StyledFilters>
        <StyledFilter>
          <FilterDropdown
            selected={settings.typer}
            onChange={(typer) => onChange({ ...settings, typer })}
            options={kodeverkSimpleValuesToDropdownOptions(kodeverk.sakstyper)}
            testId="typer-settings-dropdown"
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
        </StyledFilter>

        <StyledFilter>
          <FilterDropdown
            selected={settings.ytelser}
            onChange={(ytelser) => onChange({ ...settings, ytelser })}
            options={kodeverkSimpleValuesToDropdownOptions(availableYtelser)}
            testId="ytelser-settings-dropdown"
          >
            Ytelser
          </FilterDropdown>
          <StyledFiltersList>
            {settings.ytelser.map((ytelse) => (
              <StyledFiltersListItem key={ytelse}>
                <YtelseLabel id={ytelse} />
              </StyledFiltersListItem>
            ))}
          </StyledFiltersList>
        </StyledFilter>

        <StyledFilter>
          <FilterDropdown
            selected={settings.hjemler}
            onChange={(hjemler) => onChange({ ...settings, hjemler })}
            options={kodeverkValuesToDropdownOptions(kodeverk.hjemler)}
            testId="hjemler-settings-dropdown"
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
        </StyledFilter>
      </StyledFilters>
    </SettingsSection>
  );
};

interface EtikettProps<T = string> {
  id: T;
}

const TypeEtikett = ({ id }: EtikettProps<OppgaveType>) => (
  <StyledEtikettMain fixedWidth={true}>{useTypeNameFromId(id)}</StyledEtikettMain>
);

const YtelseLabel = ({ id }: EtikettProps) => (
  <StyledEtikettTema fixedWidth={true}>{useFullYtelseNameFromId(id)}</StyledEtikettTema>
);

const HjemmelEtikett = ({ id }: EtikettProps) => (
  <StyledEtikettMain fixedWidth={true}>{useHjemmelFromId(id)}</StyledEtikettMain>
);

const StyledEtikettMain = styled(LabelMain)`
  width: 100%;
`;

const StyledEtikettTema = styled(LabelTema)`
  width: 100%;
`;

const StyledFilter = styled.section`
  margin-right: 20px;
`;

const StyledFiltersList = styled.ul`
  padding: 0;
  margin: 0;
  margin-top: 20px;
  margin-right: 20px;
  list-style: none;
  width: 100%;
`;

const StyledFiltersListItem = styled.li`
  width: 100%;
`;

const StyledFilters = styled.div`
  display: flex;
`;
