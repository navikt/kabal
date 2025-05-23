import { disconnectCommentThread } from '@app/components/smart-editor/comments/connect-thread';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { Keys } from '@app/keys';
import { useMyPlateEditorRef } from '@app/plate/types';
import {
  useDeleteCommentOrThreadMutation,
  useGetCommentsQuery,
  useUpdateCommentOrReplyMutation,
} from '@app/redux-api/smart-editor-comments';
import type { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { Textarea } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import type React from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useContext } from 'react';

interface Props {
  comment: ISmartEditorComment;
  label: string;
}

export const WriteComment = ({ comment, label }: Props) => {
  const { id: commentId, text } = comment;
  const originalText = text;
  const [value, setValue] = useState(text);
  const ref = useRef<HTMLTextAreaElement>(null);
  const { dokumentId, setEditingComment, editingComment } = useContext(SmartEditorContext);
  const [editComment] = useUpdateCommentOrReplyMutation();
  const [deleteComment] = useDeleteCommentOrThreadMutation();
  const oppgaveId = useOppgaveId();
  const editor = useMyPlateEditorRef();
  const isLoneParent = useIsLoneParent(commentId);

  useLayoutEffect(() => {
    ref.current?.focus();
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  useEffect(() => {
    if (value === text || oppgaveId === skipToken) {
      return;
    }

    const timeout = setTimeout(async () => {
      const data = await editComment({ commentId, text: value, oppgaveId, dokumentId }).unwrap();
      setValue(data.text);
    }, 500);

    return () => clearTimeout(timeout);
  }, [value, text, commentId, oppgaveId, dokumentId, editComment]);

  if (oppgaveId === skipToken) {
    return null;
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = async (event) => {
    if (event.key === Keys.Enter && (event.metaKey || event.ctrlKey)) {
      if (text === value) {
        return;
      }

      await editComment({ commentId, text: value, oppgaveId, dokumentId }).unwrap();

      setValue('');
      setEditingComment(null);
    }

    if (event.key === Keys.Escape) {
      console.log('ESCAPE originalText', originalText);

      if (text === originalText) {
        return;
      }

      await editComment({ commentId, text: originalText, oppgaveId, dokumentId }).unwrap();

      setEditingComment(null);
      setValue('');
    }
  };

  if (editingComment === null) {
    return 'Ingen kommentar å redigere???';
  }

  return (
    <Textarea
      ref={ref}
      hideLabel
      label={label}
      maxLength={0}
      minRows={1}
      onChange={({ target }) => setValue(target.value)}
      onKeyDown={onKeyDown}
      placeholder="Skriv inn en kommentar"
      size="small"
      value={value}
      onBlur={async () => {
        setEditingComment(null);
        setValue('');

        if (value === '') {
          await deleteComment({ commentId, oppgaveId, dokumentId }).unwrap();

          if (isLoneParent) {
            disconnectCommentThread(editor, commentId);
          }

          return;
        }

        if (text === value) {
          return;
        }

        editComment({ commentId, text: value, oppgaveId, dokumentId }).unwrap();
      }}
    />
  );
};

const useIsLoneParent = (id: string) => {
  const oppgaveId = useOppgaveId();
  const { dokumentId } = useContext(SmartEditorContext);
  const { data = [] } = useGetCommentsQuery(oppgaveId === skipToken ? skipToken : { oppgaveId, dokumentId });

  const comment = data.find((comment) => comment.id === id);

  if (comment === undefined) {
    return false;
  }

  return comment.comments.length === 0;
};
