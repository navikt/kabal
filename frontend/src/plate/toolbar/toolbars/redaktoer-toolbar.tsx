import { DefaultToolbarButtons } from '@/plate/toolbar/default-toolbar-buttons';
import { InsertPlaceholder } from '@/plate/toolbar/insert-placeholder';
import { ToolbarSeparator } from '@/plate/toolbar/separator';
import { StyledToolbar } from '@/plate/toolbar/styled-components';
import { RedkatoerSettings } from '@/plate/toolbar/toolbars/redaktoer-settings';
import { SearchReplaceToolbarButton } from '@/plate/toolbar/toolbars/search-replace-toolbar-button';

export const RedaktoerToolbar = () => (
  <StyledToolbar>
    <DefaultToolbarButtons />
    <ToolbarSeparator />
    <InsertPlaceholder />
    <SearchReplaceToolbarButton />
    <RedkatoerSettings />
  </StyledToolbar>
);
