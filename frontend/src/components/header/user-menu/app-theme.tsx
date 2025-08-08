import { AppTheme, isValidUserTheme, setUserTheme, UserTheme, useSystemTheme, useUserTheme } from '@app/app-theme';
import { MonitorFillIcon, MonitorIcon, MoonIcon, SunFillIcon } from '@navikt/aksel-icons';
import { ToggleGroup } from '@navikt/ds-react';

export const AppThemeSwitcher = () => {
  const userTheme = useUserTheme();
  const systemTheme = useSystemTheme();

  return (
    <ToggleGroup
      value={userTheme}
      onChange={(value) => setUserTheme(isValidUserTheme(value) ? value : UserTheme.SYSTEM)}
      size="small"
      variant="neutral"
      className="whitespace-nowrap"
      aria-label="Velg tema"
    >
      <ToggleGroup.Item value={UserTheme.LIGHT} label="Lyst" icon={<SunFillIcon />} />
      <ToggleGroup.Item value={UserTheme.DARK} label="Mørkt" icon={<MoonIcon />} />
      <ToggleGroup.Item
        value={UserTheme.SYSTEM}
        label="System"
        icon={systemTheme === AppTheme.DARK ? <MonitorIcon /> : <MonitorFillIcon />}
      />
    </ToggleGroup>
  );
};
