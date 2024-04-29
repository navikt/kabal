import React from 'react';
import { DefaultToolbarButtons } from '@app/plate/toolbar/default-toolbar-buttons';
import { InsertPlaceholder } from '@app/plate/toolbar/insert-placeholder';
import { ToolbarSeparator } from '@app/plate/toolbar/separator';
import { FirstRow, StyledToolbar } from '@app/plate/toolbar/styled-components';
import { RedkatoerSettings } from '@app/plate/toolbar/toolbars/redaktoer-settings';

export const RedaktoerToolbar = () => (
  <StyledToolbar>
    <FirstRow>
      <DefaultToolbarButtons />
      <ToolbarSeparator />
      <InsertPlaceholder />
      <RedkatoerSettings />
    </FirstRow>
  </StyledToolbar>
);
