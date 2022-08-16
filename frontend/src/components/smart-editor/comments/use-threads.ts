import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { useContext, useMemo } from 'react';
import { Descendant, Text } from 'slate';
import { isNotUndefined } from '../../../functions/is-not-type-guards';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetCommentsQuery } from '../../../redux-api/smart-editor-comments';
import { ISmartEditorComment } from '../../../types/smart-editor/comments';
import { isCommentableVoid } from '../../rich-text/types/editor-type-guards';
import { SmartEditorContext } from '../context/smart-editor-context';

interface FocusedComment extends ISmartEditorComment {
  isFocused: boolean;
}

interface Threads {
  attached: FocusedComment[];
  orphans: FocusedComment[];
  isLoading: boolean;
}

const LOADING: Threads = {
  attached: [],
  orphans: [],
  isLoading: true,
};

export const useThreads = (): Threads => {
  const oppgaveId = useOppgaveId();
  const { focusedThreadId, documentId, editor } = useContext(SmartEditorContext);

  const query = useMemo(() => {
    if (documentId === null || oppgaveId === skipToken) {
      return skipToken;
    }

    return { oppgaveId, dokumentId: documentId };
  }, [documentId, oppgaveId]);

  const { data: threads, isLoading: threadsIsLoading } = useGetCommentsQuery(query);

  if (threadsIsLoading || editor === null || typeof threads === 'undefined') {
    return LOADING;
  }

  const attachedThreadIds = [...new Set(getRichTextThreadIds(editor.children))];

  return {
    attached: attachedThreadIds
      .map((threadId) => {
        const thread = threads.find(({ id }) => id === threadId);

        if (typeof thread === 'undefined') {
          return undefined;
        }

        return {
          ...thread,
          isFocused: focusedThreadId === thread.id,
        };
      })
      .filter(isNotUndefined),
    orphans: threads
      .filter(({ id }) => !attachedThreadIds.includes(id))
      .map((thread) => ({
        ...thread,
        isFocused: focusedThreadId === thread.id,
      })),
    isLoading: false,
  };
};

const getRichTextThreadIds = (richText: Descendant[]): string[] =>
  richText.flatMap<string>((child) => {
    if (Text.isText(child)) {
      return Object.keys(child)
        .filter((key) => key.startsWith('commentThreadId_'))
        .map((key) => key.replace('commentThreadId_', ''));
    }

    if (typeof child === 'undefined' || child === null) {
      return [];
    }

    if (isCommentableVoid(child)) {
      return child.threadIds;
    }

    return getRichTextThreadIds(child.children);
  });
