import { Delete, SuccessStroke } from '@navikt/ds-icons';
import { Button, Switch } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { useAvailableYtelser } from '../../hooks/use-available-ytelser';
import { ISettings, useGetSettingsQuery, useUpdateSettingsMutation } from '../../redux-api/bruker';
import { useGetKodeverkQuery } from '../../redux-api/kodeverk';
import { IKodeverkSimpleValue, IKodeverkValue } from '../../types/kodeverk';
import {
  ButtonContainer,
  SectionHeader,
  SettingsSection,
  StyledFieldset,
  StyledFilterContainer,
  StyledFilters,
} from './styled-components';

const EMPTY_SETTINGS: ISettings = {
  typer: [],
  ytelser: [],
  hjemler: [],
};

const useHjemler = () => {
  const { data } = useGetSettingsQuery();
  const ytelser = useAvailableYtelser();

  const availableHjemler = useMemo(
    () =>
      ytelser
        .filter((ytelse) => data?.ytelser.includes(ytelse.id))
        .flatMap(({ innsendingshjemler }) => innsendingshjemler)
        .reduce<IKodeverkValue<string>[]>((acc, item) => {
          const exists = acc.some(({ id }) => id === item.id);

          if (!exists) {
            acc.push(item);
          }

          return acc;
        }, [])
        .sort(({ navn: a }, { navn: b }) => a.localeCompare(b)),
    [data?.ytelser, ytelser]
  );

  return availableHjemler;
};

export const Filters = () => {
  const { data: kodeverk } = useGetKodeverkQuery();
  const { data: settingsData } = useGetSettingsQuery();
  const hjemler = useHjemler();
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
        <Button variant="secondary" size="small" onClick={removeAll} data-testid={`${settingKey}-remove-all`}>
          <Delete /> Fjern alle
        </Button>
        <Button variant="secondary" size="small" onClick={selectAll} data-testid={`${settingKey}-select-all`}>
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
