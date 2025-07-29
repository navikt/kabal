import { setUserDarkMode, useDarkMode } from '@app/darkmode';
import { pushEvent } from '@app/observability';
import { HStack, Switch, Tooltip } from '@navikt/ds-react';

export const DarkModeSwitch = () => {
  const darkMode = useDarkMode();

  return (
    <Tooltip content={darkMode ? 'Bytt til lyst tema' : 'Bytt til mørkt tema'} placement="left">
      <Switch
        size="small"
        onClick={() => {
          setUserDarkMode(!darkMode);
          pushEvent(darkMode ? 'theme-light' : 'theme-dark', 'theme');
        }}
        className="w-full"
        checked={darkMode}
      >
        <HStack gap="2" align="center">
          <span>{darkMode ? '🌙' : '☀️'}</span>
          <span>{darkMode ? 'Mørkt tema' : 'Lyst tema'}</span>
        </HStack>
      </Switch>
    </Tooltip>
  );
};
