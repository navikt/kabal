import { StaticDataContext } from '@app/components/app/static-data-context';
import { connectCommentThread } from '@app/components/smart-editor/comments/connect-thread';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { MOD_KEY_TEXT } from '@app/keys';
import { useSelection } from '@app/plate/hooks/use-selection';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { useMyPlateEditorRef } from '@app/plate/types';
import { usePostCommentMutation } from '@app/redux-api/smart-editor-comments';
import type { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { ChatElipsisIcon } from '@navikt/aksel-icons';
import { skipToken } from '@reduxjs/toolkit/query';
import { RangeApi } from '@udecode/plate';
import { useContext } from 'react';

export const CommentsButton = () => {
  const oppgaveId = useOppgaveId();
  const { setNewCommentSelection, dokumentId, editingComment, setEditingComment } = useContext(SmartEditorContext);
  const selection = useSelection();
  const [postComment, { isLoading }] = usePostCommentMutation();
  const { user } = useContext(StaticDataContext);
  const editor = useMyPlateEditorRef();

  if (oppgaveId === skipToken) {
    return null;
  }

  return (
    <ToolbarIconButton
      label="Legg til kommentar"
      keys={[MOD_KEY_TEXT, 'K']}
      icon={<ChatElipsisIcon width={24} />}
      onClick={async () => {
        if (selection === null || RangeApi.isCollapsed(selection)) {
          return;
        }

        const comment: ISmartEditorComment = await postComment({
          author: { ident: user.navIdent, name: user.navn },
          dokumentId,
          oppgaveId,
          text: '',
        }).unwrap();

        connectCommentThread(editor, selection, comment.id);

        setNewCommentSelection(selection);
        setEditingComment(comment);
      }}
      active={editingComment !== null}
      disabled={selection === null || RangeApi.isCollapsed(selection)}
      loading={isLoading}
    />
  );
};
