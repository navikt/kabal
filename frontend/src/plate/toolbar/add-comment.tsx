import { ChatElipsisIcon } from '@navikt/aksel-icons';
import React, { useContext } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { MOD_KEY } from '@app/mod-key';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { useMyPlateEditorState } from '@app/plate/types';

export const CommentsButton = () => {
  const { setNewCommentSelection, newCommentSelection } = useContext(SmartEditorContext);
  const editor = useMyPlateEditorState();
  const { selection } = editor;

  return (
    <ToolbarIconButton
      label="Legg til kommentar"
      keys={[MOD_KEY, 'K']}
      icon={<ChatElipsisIcon width={24} />}
      onClick={() => setNewCommentSelection(selection)}
      active={newCommentSelection !== null}
    />
  );
};
