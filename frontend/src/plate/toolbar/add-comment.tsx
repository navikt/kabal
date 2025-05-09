import { SmartEditorContext } from '@app/components/smart-editor/context';
import { MOD_KEY_TEXT } from '@app/keys';
import { useSelection } from '@app/plate/hooks/use-selection';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { ChatElipsisIcon } from '@navikt/aksel-icons';
import { RangeApi } from '@udecode/plate';
import { useContext } from 'react';

export const CommentsButton = () => {
  const { setNewCommentSelection, newCommentSelection } = useContext(SmartEditorContext);
  const selection = useSelection();

  return (
    <ToolbarIconButton
      label="Legg til kommentar"
      keys={[MOD_KEY_TEXT, 'K']}
      icon={<ChatElipsisIcon width={24} />}
      onClick={() => setNewCommentSelection(selection)}
      active={newCommentSelection !== null}
      disabled={selection === null || RangeApi.isCollapsed(selection)}
    />
  );
};
