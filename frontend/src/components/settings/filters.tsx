import { useAvailableYtelser } from '@app/hooks/use-available-ytelser';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@app/redux-api/bruker';
import { type ISettings, Role } from '@app/types/bruker';
import type { IKodeverkSimpleValue } from '@app/types/kodeverk';
import { CheckmarkIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Fieldset, HGrid, HStack, Switch, VStack } from '@navikt/ds-react';
import { useMemo } from 'react';
import { SectionHeader, SettingsSection } from './styled-components';
import { useHjemlerFromSettingsYtelser } from './use-hjemler-from-settings-ytelser';

const EMPTY_SETTINGS: ISettings = {
  ytelser: [],
  hjemler: [],
};

export const Filters = () => {
  const { data: settingsData } = useGetSettingsQuery();
  const hjemler = useHjemlerFromSettingsYtelser();
  const ytelser = useAvailableYtelser();
  const isSaksbehandler = useHasRole(Role.KABAL_SAKSBEHANDLING);

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
    [settingsData?.hjemler, ytelser],
  );

  const settings = settingsData ?? EMPTY_SETTINGS;

  if (!isSaksbehandler) {
    return null;
  }

  return (
    <SettingsSection gridColumn="filters">
      <SectionHeader>Velg hvilke ytelser og hjemler du har kompetanse til å behandle</SectionHeader>

      <VStack gap="5" width="100%">
        <SettingsFilter label="Ytelser" options={ytelserOptions} selected={settings.ytelser} settingKey="ytelser" />
        <SettingsFilter label="Hjemler" options={hjemler} selected={settings.hjemler} settingKey="hjemler" />
      </VStack>
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
    <section className="relative">
      <HStack gap="0 2" position="absolute" top="0" right="0">
        <Button
          type="button"
          variant="secondary-neutral"
          size="small"
          onClick={removeAll}
          data-testid={`${settingKey}-remove-all`}
          icon={<TrashIcon aria-hidden />}
        >
          Fjern alle
        </Button>
        <Button
          type="button"
          variant="secondary-neutral"
          size="small"
          onClick={selectAll}
          data-testid={`${settingKey}-select-all`}
          icon={<CheckmarkIcon aria-hidden />}
        >
          Velg alle
        </Button>
      </HStack>

      <HGrid asChild width="100%" columns="repeat(auto-fit, 300px)">
        <Fieldset data-testid={`${settingKey}-settings`} legend={legend}>
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
        </Fieldset>
      </HGrid>
    </section>
  );
};
