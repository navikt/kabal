import { skipToken } from '@reduxjs/toolkit/query';
import { RangeApi } from 'platejs';
import { useCallback, useContext } from 'react';
import type { BaseRange } from 'slate';
import { StaticDataContext } from '@/components/app/static-data-context';
import { connectCommentThread } from '@/components/smart-editor/comments/connect-thread';
import { SmartEditorContext } from '@/components/smart-editor/context';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useMyPlateEditorRef } from '@/plate/types';
import { usePostCommentMutation } from '@/redux-api/smart-editor-comments';

interface UseAddCommentResult {
  addComment: (selection: BaseRange | null) => Promise<void>;
  isLoading: boolean;
  isAvailable: boolean;
}

export const useAddComment = (): UseAddCommentResult => {
  const oppgaveId = useOppgaveId();
  const { setNewCommentSelection, dokumentId, setEditingComment } = useContext(SmartEditorContext);
  const [postComment, { isLoading }] = usePostCommentMutation();
  const { user } = useContext(StaticDataContext);
  const editor = useMyPlateEditorRef();

  const isAvailable = oppgaveId !== skipToken;

  const addComment = useCallback(
    async (selection: BaseRange | null) => {
      if (oppgaveId === skipToken) {
        return;
      }

      if (selection === null || RangeApi.isCollapsed(selection)) {
        return;
      }

      const comment = await postComment({
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
    },
    [oppgaveId, postComment, user.navIdent, user.navn, dokumentId, editor, setNewCommentSelection, setEditingComment],
  );

  return { addComment, isLoading, isAvailable };
};
