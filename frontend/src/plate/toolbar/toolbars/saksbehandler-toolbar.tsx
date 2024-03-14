import { ClockDashedIcon, FileExportIcon, InboxUpIcon, LightBulbIcon } from '@navikt/aksel-icons';
import React, { useContext } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useBehandlingEnabled } from '@app/hooks/settings/use-setting';
import { MOD_KEY } from '@app/keys';
import { pushEvent } from '@app/observability';
import { DefaultToolbarButtons } from '@app/plate/toolbar/default-toolbar-buttons';
import { ToolbarSeparator } from '@app/plate/toolbar/separator';
import { FirstRow, StyledToolbar } from '@app/plate/toolbar/styled-components';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';

interface Props {
  showHistory: boolean;
  setShowHistory: (showHistory: boolean) => void;
}

export const SaksbehandlerToolbar = ({ setShowHistory, showHistory }: Props) => {
  const { showGodeFormuleringer, setShowGodeFormuleringer, showAnnotationsAtOrigin, setShowAnnotationsAtOrigin } =
    useContext(SmartEditorContext);
  const { value: behandlingEnabled = true, setValue: setBehandlingEnabled } = useBehandlingEnabled();

  return (
    <StyledToolbar>
      <FirstRow>
        <DefaultToolbarButtons />

        <ToolbarSeparator />

        <ToolbarIconButton
          label="Vis gode formuleringer"
          keys={[MOD_KEY, 'Shift', 'F']}
          icon={<LightBulbIcon aria-hidden />}
          active={showGodeFormuleringer}
          onClick={() => {
            if (!showGodeFormuleringer) {
              pushEvent('show-gode-formuleringer', { enabled: 'true' }, 'smart-editor');
            }
            setShowGodeFormuleringer(!showGodeFormuleringer);
          }}
        />

        <ToolbarIconButton
          label="Vis historikk"
          keys={[MOD_KEY, 'Shift', 'H']}
          icon={<ClockDashedIcon aria-hidden />}
          active={showHistory}
          onClick={() => {
            const enabled = !showHistory;
            pushEvent('toggle-show-history', { enabled: enabled.toString() }, 'smart-editor');
            setShowHistory(enabled);
          }}
        />

        <ToolbarSeparator />

        <ToolbarIconButton
          label="Vis kommentarer og bokmerker ved siden av innhold"
          icon={<FileExportIcon aria-hidden />}
          active={showAnnotationsAtOrigin}
          onClick={() => {
            const enabled = !showAnnotationsAtOrigin;
            pushEvent('toggle-show-annotations-at-origin', { enabled: enabled.toString() }, 'smart-editor');
            setShowAnnotationsAtOrigin(enabled);
          }}
        />

        <ToolbarSeparator />

        <ToolbarIconButton
          label="Vis behandling"
          icon={<InboxUpIcon aria-hidden />}
          active={behandlingEnabled}
          onClick={() => {
            const enabled = !behandlingEnabled;
            pushEvent('toggle-behandling-panel', { enabled: enabled.toString() }, 'smart-editor');
            setBehandlingEnabled(enabled);
          }}
        />
      </FirstRow>
    </StyledToolbar>
  );
};
