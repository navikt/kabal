import { Dropdown } from '@navikt/ds-react';
import { useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';

// const OPPGAVE_PATH_PREFIX_LIST = [
//   '/klagebehandling',
//   '/ankebehandling',
//   '/trygderettsankebehandling',
//   '/behandling-etter-tr-opphevet',
// ];

// export const DebugButton = () => {
//   console.log('DebugButton', window.location.pathname);
//   const isOppgavePath = OPPGAVE_PATH_PREFIX_LIST.some((path) => window.location.pathname.startsWith(path));

//   if (isOppgavePath) {
//     return <BehandlingDebug />;
//   }

//   return null;
// };

export const BehandlingDebug = () => {
  const oppgave = useOppgave();

  const onClick: React.MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log(oppgave);
    },
    [oppgave],
  );

  const userMenu = document.getElementById('user-menu');

  if (userMenu === null) {
    return null;
  }

  return createPortal(
    <Dropdown.Menu.List.Item onClick={onClick}>Send info til Team Klage</Dropdown.Menu.List.Item>,
    userMenu,
  );
};
