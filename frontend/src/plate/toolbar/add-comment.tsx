import { ChatElipsisIcon } from '@navikt/aksel-icons';
import { skipToken } from '@reduxjs/toolkit/query';
import { RangeApi } from 'platejs';
import { useContext } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import { connectCommentThread } from '@/components/smart-editor/comments/connect-thread';
import { SmartEditorContext } from '@/components/smart-editor/context';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { MOD_KEY_TEXT } from '@/keys';
import { useSelection } from '@/plate/hooks/use-selection';
import { ToolbarIconButton } from '@/plate/toolbar/toolbarbutton';
import { useMyPlateEditorRef } from '@/plate/types';
import { usePostCommentMutation } from '@/redux-api/smart-editor-comments';
import type { ISmartEditorComment } from '@/types/smart-editor/comments';

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

        setTimeout(() => {
          setNewCommentSelection(selection);
          setEditingComment(comment);
        }, 50);
      }}
      active={editingComment !== null}
      disabled={selection === null || RangeApi.isCollapsed(selection)}
      loading={isLoading}
    />
  );
};
