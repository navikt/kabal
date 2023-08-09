import { LightBulbIcon } from '@navikt/aksel-icons';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { SavedStatus, SavedStatusProps } from '@app/components/saved-status/saved-status';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { MOD_KEY } from '@app/mod-key';
import { DefaultToolbarButtons } from '@app/plate/toolbar/default-toolbar-buttons';
import { ToolbarSeparator } from '@app/plate/toolbar/separator';
import { FirstRow, StyledToolbar } from '@app/plate/toolbar/styled-components';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';

export const SaksbehandlerToolbar = ({ ...status }: SavedStatusProps) => {
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

        <ToolbarSeparator />

        <StatusContainer>
          <SavedStatus {...status} />
        </StatusContainer>
      </FirstRow>
    </StyledToolbar>
  );
};

const StatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
`;
