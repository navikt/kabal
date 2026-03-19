import { Button, Tooltip } from '@navikt/ds-react';
import { Keyboard } from '@styled-icons/fluentui-system-regular/Keyboard';
import { openPanelKeyboardHelpModal } from '@/components/oppgavebehandling-controls/keyboard-help/state';

const TITLE = 'Vis hjelp for panelnavigering';

export const PanelKeyboardHelpButton = () => (
  <Tooltip content={TITLE} placement="top">
    <Button
      data-color="neutral"
      variant="tertiary"
      size="small"
      aria-label={TITLE}
      icon={<Keyboard size={22} aria-hidden />}
      onClick={openPanelKeyboardHelpModal}
    />
  </Tooltip>
);
