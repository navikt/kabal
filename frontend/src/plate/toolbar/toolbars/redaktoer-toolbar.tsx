import React from 'react';
import { DefaultToolbarButtons } from '@app/plate/toolbar/default-toolbar-buttons';
import { InsertPlaceholder } from '@app/plate/toolbar/insert-placeholder';
import { ToolbarSeparator } from '@app/plate/toolbar/separator';
import { FirstRow, StyledToolbar } from '@app/plate/toolbar/styled-components';
import { Settings } from '@app/plate/toolbar/toolbars/settings';

export const RedaktoerToolbar = () => (
  <StyledToolbar>
    <FirstRow>
      <DefaultToolbarButtons />
      <ToolbarSeparator />
      <InsertPlaceholder />
      <Settings />
    </FirstRow>
  </StyledToolbar>
);
