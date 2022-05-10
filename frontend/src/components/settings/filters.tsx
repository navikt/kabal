import { Delete, SuccessStroke } from '@navikt/ds-icons';
import { Button, Switch } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { useAvailableYtelser } from '../../hooks/use-available-ytelser';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../../redux-api/bruker';
import { useGetKodeverkQuery } from '../../redux-api/kodeverk';
import { ISettings } from '../../types/bruker';
import { IKodeverkSimpleValue } from '../../types/kodeverk';
import {
  ButtonContainer,
  SectionHeader,
  SettingsSection,
  StyledFieldset,
  StyledFilterContainer,
  StyledFilters,
} from './styled-components';
import { useHjemlerFromSettingsYtelser } from './use-hjemler-from-settings-ytelser';

const EMPTY_SETTINGS: ISettings = {
  typer: [],
  ytelser: [],
  hjemler: [],
};

export const Filters = () => {
  const { data: kodeverk } = useGetKodeverkQuery();
  const { data: settingsData } = useGetSettingsQuery();
  const hjemler = useHjemlerFromSettingsYtelser();
  const ytelser = useAvailableYtelser();

  const ytelserOptions = useMemo(
    () =>
      ytelser.map(({ navn, innsendingshjemler, ...rest }) => {
        const selectedHjemler = innsendingshjemler.filter(({ id }) => settingsData?.hjemler.includes(id)).length;
        const totalHjemler = innsendingshjemler.length;
        const name = `${navn} (${selectedHjemler}/${totalHjemler})`;

        return {
          ...rest,
          navn: name,
          innsendingshjemler,
        };
      }),
    [settingsData?.hjemler, ytelser]
  );

  const settings = settingsData ?? EMPTY_SETTINGS;

  if (typeof kodeverk === 'undefined') {
    return null;
  }

  return (
    <SettingsSection>
      <SectionHeader>Velg hvilke ytelser og hjemler du har kompetanse til å behandle</SectionHeader>

      <StyledFilters>
        <SettingsFilter label="Typer" options={kodeverk.sakstyper} selected={settings.typer} settingKey="typer" />
        <SettingsFilter label="Ytelser" options={ytelserOptions} selected={settings.ytelser} settingKey="ytelser" />
        <SettingsFilter label="Hjemler" options={hjemler} selected={settings.hjemler} settingKey="hjemler" />
      </StyledFilters>
    </SettingsSection>
  );
};

interface SettingsSectionProps {
  label: string;
  options: IKodeverkSimpleValue[];
  selected: string[];
  settingKey: keyof ISettings;
}

const SettingsFilter = ({ selected, options, settingKey, label }: SettingsSectionProps) => {
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation();
  const { data: settingsData } = useGetSettingsQuery();

  const onChange = (settings: ISettings) => {
    if (isLoading) {
      return;
    }

    updateSettings(settings);
  };

  const settings = settingsData ?? EMPTY_SETTINGS;

  const selectAll = () => {
    onChange({ ...settings, [settingKey]: options.map(({ id }) => id) });
  };

  const removeAll = () => {
    onChange({ ...settings, [settingKey]: [] });
  };

  const orphanText = selected.length > options.length ? `, ${selected.length - options.length} skjulte` : '';

  const legend = `${label} (${selected.length} av ${options.length} valgt${orphanText})`;

  return (
    <StyledFilterContainer>
      <ButtonContainer>
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={removeAll}
          data-testid={`${settingKey}-remove-all`}
        >
          <Delete /> Fjern alle
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={selectAll}
          data-testid={`${settingKey}-select-all`}
        >
          <SuccessStroke /> Velg alle
        </Button>
      </ButtonContainer>
      <StyledFieldset data-testid={`${settingKey}-settings`} legend={legend}>
        {options.map(({ id, navn }) => (
          <Switch
            key={id}
            value={id}
            size="medium"
            position="left"
            checked={selected.includes(id)}
            data-type={settingKey}
            data-id={id}
            data-testid={`${settingKey}-${id}`}
            onChange={(event) => {
              if (event.target.checked === true) {
                onChange({ ...settings, [settingKey]: [...selected, id] });
              } else {
                onChange({ ...settings, [settingKey]: selected.filter((t) => t !== id) });
              }
            }}
          >
            {navn}
          </Switch>
        ))}
      </StyledFieldset>
    </StyledFilterContainer>
  );
};
