import { ClockDashedIcon, LightBulbIcon } from '@navikt/aksel-icons';
import { useSmartEditorGodeFormuleringerOpen, useSmartEditorHistoryOpen } from '@/hooks/settings/use-setting';
import { MOD_KEY_TEXT } from '@/keys';
import { pushEvent } from '@/observability';
import { DefaultToolbarButtons } from '@/plate/toolbar/default-toolbar-buttons';
import { ToolbarSeparator } from '@/plate/toolbar/separator';
import { StyledToolbar } from '@/plate/toolbar/styled-components';
import { ToolbarIconButton } from '@/plate/toolbar/toolbarbutton';
import { SaksbehandlerSettings } from '@/plate/toolbar/toolbars/saksbehandler-settings';
import { SearchReplaceToolbarButton } from '@/plate/toolbar/toolbars/search-replace-toolbar-button';

export const SaksbehandlerToolbar = () => {
  const { value: showGodeFormuleringer, setValue: setShowGodeFormuleringer } = useSmartEditorGodeFormuleringerOpen();
  const { value: showHistory = false, setValue: setShowHistory } = useSmartEditorHistoryOpen();

  return (
    <StyledToolbar>
      <DefaultToolbarButtons />

      <ToolbarSeparator />

      <SearchReplaceToolbarButton />

      <ToolbarIconButton
        label="Vis gode formuleringer"
        keys={[MOD_KEY_TEXT, 'Shift', 'G']}
        icon={<LightBulbIcon aria-hidden />}
        active={showGodeFormuleringer}
        onClick={() => {
          pushEvent('toggle-gode-formuleringer', 'smart-editor', {
            enabled: showGodeFormuleringer === false ? 'true' : 'false',
          });
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
    </StyledToolbar>
  );
};
