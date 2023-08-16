import { ChatElipsisIcon } from '@navikt/aksel-icons';
import { isCollapsed, usePlateSelection } from '@udecode/plate-common';
import React, { useContext } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { MOD_KEY } from '@app/mod-key';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';

export const CommentsButton = () => {
  const { setNewCommentSelection, newCommentSelection } = useContext(SmartEditorContext);
  const selection = usePlateSelection();

  return (
    <ToolbarIconButton
      label="Legg til kommentar"
      keys={[MOD_KEY, 'K']}
      icon={<ChatElipsisIcon width={24} />}
      onClick={() => setNewCommentSelection(selection)}
      active={newCommentSelection !== null}
      disabled={selection === null || isCollapsed(selection)}
    />
  );
};
