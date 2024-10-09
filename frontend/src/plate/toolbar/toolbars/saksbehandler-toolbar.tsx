import { ClockDashedIcon, LightBulbIcon } from '@navikt/aksel-icons';
import { useContext } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { MOD_KEY } from '@app/keys';
import { pushEvent } from '@app/observability';
import { DefaultToolbarButtons } from '@app/plate/toolbar/default-toolbar-buttons';
import { ToolbarSeparator } from '@app/plate/toolbar/separator';
import { FirstRow, StyledToolbar } from '@app/plate/toolbar/styled-components';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { SaksbehandlerSettings } from '@app/plate/toolbar/toolbars/saksbehandler-settings';

interface Props {
  showHistory: boolean;
  setShowHistory: (showHistory: boolean) => void;
}

export const SaksbehandlerToolbar = ({ setShowHistory, showHistory }: Props) => {
  const { showGodeFormuleringer, setShowGodeFormuleringer } = useContext(SmartEditorContext);

  return (
    <StyledToolbar>
      <FirstRow>
        <DefaultToolbarButtons />

        <ToolbarSeparator />

        <ToolbarIconButton
          label="Vis gode formuleringer"
          keys={[MOD_KEY, 'Shift', 'G']}
          icon={<LightBulbIcon aria-hidden />}
          active={showGodeFormuleringer}
          onClick={() => {
            pushEvent('toggle-gode-formuleringer', 'smart-editor', { enabled: showGodeFormuleringer.toString() });
            setShowGodeFormuleringer(!showGodeFormuleringer);
          }}
        />

        <ToolbarIconButton
          label="Vis historikk"
          icon={<ClockDashedIcon aria-hidden />}
          active={showHistory}
          onClick={() => {
            const enabled = !showHistory;
            pushEvent('toggle-show-history', 'smart-editor', { enabled: enabled.toString() });
            setShowHistory(enabled);
          }}
        />

        <ToolbarSeparator />

        <SaksbehandlerSettings />
      </FirstRow>
    </StyledToolbar>
  );
};
