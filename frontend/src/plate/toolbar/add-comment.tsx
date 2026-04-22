import { ChatElipsisIcon } from '@navikt/aksel-icons';
import { RangeApi } from 'platejs';
import { useContext } from 'react';
import { SmartEditorContext } from '@/components/smart-editor/context';
import { useAddComment } from '@/components/smart-editor/hooks/use-add-comment';
import { MOD_KEY_TEXT } from '@/keys';
import { useSelection } from '@/plate/hooks/use-selection';
import { ToolbarIconButton } from '@/plate/toolbar/toolbarbutton';

export const CommentsButton = () => {
  const { editingComment } = useContext(SmartEditorContext);
  const selection = useSelection();
  const { addComment, isLoading, isAvailable } = useAddComment();

  if (!isAvailable) {
    return null;
  }

  return (
    <ToolbarIconButton
      label="Legg til kommentar"
      keys={[MOD_KEY_TEXT, 'Shift', 'K']}
      icon={<ChatElipsisIcon width={24} />}
      onClick={() => addComment(selection)}
      active={editingComment !== null}
      disabled={selection === null || RangeApi.isCollapsed(selection)}
      loading={isLoading}
    />
  );
};
