import React from 'react';
import styled from 'styled-components';
import { useAvailableYtelser } from '../../hooks/use-available-ytelser';
import { useFullYtelseNameFromId, useHjemmelFromId, useTypeNameFromId } from '../../hooks/use-kodeverk-ids';
import { ISettings, useGetBrukerQuery, useUpdateSettingsMutation } from '../../redux-api/bruker';
import { useGetKodeverkQuery } from '../../redux-api/kodeverk';
import { LabelMain, LabelTema } from '../../styled-components/labels';
import { OppgaveType } from '../../types/kodeverk';
import { kodeverkSimpleValuesToDropdownOptions, kodeverkValuesToDropdownOptions } from '../dropdown/dropdown';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';

const EMPTY_SETTINGS: ISettings = {
  typer: [],
  ytelser: [],
  hjemler: [],
};

export const Settings = () => {
  const { data: kodeverk } = useGetKodeverkQuery();
  const { data: userData } = useGetBrukerQuery();
  const [updateSettings, updateState] = useUpdateSettingsMutation();

  const onChange = (settings: ISettings) => {
    if (typeof userData === 'undefined' || updateState.isLoading) {
      return;
    }

    const { navIdent } = userData.info;
    updateSettings({ navIdent, ...settings });
  };

  const settings = userData?.innstillinger ?? EMPTY_SETTINGS;

  const availableYtelser = useAvailableYtelser();

  if (typeof kodeverk === 'undefined') {
    return null;
  }

  return (
    <article>
      <h1>Velg hvilke ytelser og hjemler du har kompetanse til å behandle</h1>
      <StyledContent>
        <StyledSettingsSection>
          <FilterDropdown
            selected={settings.typer}
            onChange={(typer) => onChange({ ...settings, typer })}
            options={kodeverkSimpleValuesToDropdownOptions(kodeverk.sakstyper)}
            data-testid="typer-settings-dropdown"
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
            selected={settings.ytelser}
            onChange={(ytelser) => onChange({ ...settings, ytelser })}
            options={kodeverkValuesToDropdownOptions(availableYtelser)}
            data-testid="ytelser-settings-dropdown"
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
        </StyledSettingsSection>
        <StyledSettingsSection>
          <FilterDropdown
            selected={settings.hjemler}
            onChange={(hjemler) => onChange({ ...settings, hjemler })}
            options={kodeverkValuesToDropdownOptions(kodeverk.hjemler)}
            data-testid="hjemler-settings-dropdown"
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
