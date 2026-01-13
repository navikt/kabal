import { DefaultToolbarButtons } from '@app/plate/toolbar/default-toolbar-buttons';
import { InsertPlaceholder } from '@app/plate/toolbar/insert-placeholder';
import { ToolbarSeparator } from '@app/plate/toolbar/separator';
import { StyledToolbar } from '@app/plate/toolbar/styled-components';
import { RedkatoerSettings } from '@app/plate/toolbar/toolbars/redaktoer-settings';
import { SearchReplaceToolbarButton } from '@app/plate/toolbar/toolbars/search-replace-toolbar-button';

export const RedaktoerToolbar = () => (
  <StyledToolbar>
    <DefaultToolbarButtons />
    <ToolbarSeparator />
    <InsertPlaceholder />
    <SearchReplaceToolbarButton />
    <RedkatoerSettings />
  </StyledToolbar>
);
