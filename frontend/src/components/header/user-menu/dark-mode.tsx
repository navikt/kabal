import { useDarkMode } from '@app/hooks/settings/use-setting';
import { HStack, Switch, Tooltip } from '@navikt/ds-react';

export const DarkModeSwitch = () => {
  const { value: darkMode, setValue: setDarkMode } = useDarkMode();

  return (
    <Tooltip content={darkMode ? 'Bytt til lyst tema' : 'Bytt til mørkt tema'} placement="left">
      <Switch size="small" onClick={() => setDarkMode(!darkMode)} className="w-full" checked={darkMode}>
        <HStack gap="2" align="center">
          <span>{darkMode ? '🌙' : '☀️'}</span>
          <span>{darkMode ? 'Mørkt tema' : 'Lyst tema'}</span>
        </HStack>
      </Switch>
    </Tooltip>
  );
};
