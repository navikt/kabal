import { Dropdown } from '@navikt/ds-react';
import { useCallback } from 'react';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';

const OPPGAVE_PATH_PREFIX_LIST = [
  'klagebehandling',
  'ankebehandling',
  'trygderettsankebehandling',
  'behandling-etter-tr-opphevet',
];

export const DebugButton = () => {
  const isOppgavePath = OPPGAVE_PATH_PREFIX_LIST.some((path) => window.location.pathname.startsWith(path));

  if (isOppgavePath) {
    return <BehandlingDebug />;
  }

  return null;
};

const BehandlingDebug = () => {
  const oppgave = useOppgave();

  const onClick = useCallback(() => {
    console.log(oppgave);
  }, [oppgave]);

  return <Dropdown.Menu.List.Item onClick={onClick}>Send info til Team Klage</Dropdown.Menu.List.Item>;
};
