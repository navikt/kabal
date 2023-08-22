import { LightBulbIcon } from '@navikt/aksel-icons';
import React, { useContext } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { MOD_KEY } from '@app/mod-key';
import { DefaultToolbarButtons } from '@app/plate/toolbar/default-toolbar-buttons';
import { ToolbarSeparator } from '@app/plate/toolbar/separator';
import { FirstRow, StyledToolbar } from '@app/plate/toolbar/styled-components';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';

export const SaksbehandlerToolbar = () => {
  const { showGodeFormuleringer, setShowGodeFormuleringer } = useContext(SmartEditorContext);

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
          onClick={() => setShowGodeFormuleringer(!showGodeFormuleringer)}
        />
      </FirstRow>
    </StyledToolbar>
  );
};
