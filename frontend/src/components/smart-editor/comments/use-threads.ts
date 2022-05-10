import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { useContext } from 'react';
import { Descendant, Text } from 'slate';
import { isNotUndefined } from '../../../functions/is-not-type-guards';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetSmartEditorQuery } from '../../../redux-api/smart-editor-api';
import { useGetCommentsQuery } from '../../../redux-api/smart-editor-comments';
import { ISmartEditorComment } from '../../../types/smart-editor-comments';
import { SmartEditorContext } from '../context/smart-editor-context';
import { isCommentableVoid } from '../editor-type-guards';

export interface FocusedComment extends ISmartEditorComment {
  isFocused: boolean;
}

export interface Threads {
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
  const { focusedThreadId, documentId } = useContext(SmartEditorContext);

  const { data: smartEditor, isLoading } = useGetSmartEditorQuery(
    documentId === null ? skipToken : { oppgaveId, dokumentId: documentId }
  );

  const { data: threads, isLoading: threadsIsLoading } = useGetCommentsQuery(
    documentId === null ? skipToken : { oppgaveId, dokumentId: documentId }
  );

  if (
    isLoading ||
    threadsIsLoading ||
    smartEditor === null ||
    typeof smartEditor === 'undefined' ||
    typeof threads === 'undefined'
  ) {
    return LOADING;
  }

  const attachedThreadIds = [...new Set(getRichTextThreadIds(smartEditor.content))];

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

    if (isCommentableVoid(child)) {
      return child.threadIds;
    }

    return getRichTextThreadIds(child.children);
  });
