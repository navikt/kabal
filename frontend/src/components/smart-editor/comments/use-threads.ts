import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { useContext, useMemo } from 'react';
import { Descendant, Text } from 'slate';
import { useSlateStatic } from 'slate-react';
import { isNotUndefined } from '@app/functions/is-not-type-guards';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetCommentsQuery } from '@app/redux-api/smart-editor-comments';
import { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { COMMENT_PREFIX } from '../constants';
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
  const editor = useSlateStatic();
  const { focusedThreadId, documentId } = useContext(SmartEditorContext);

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
        .filter((key) => key.startsWith(COMMENT_PREFIX))
        .map((key) => key.replace(COMMENT_PREFIX, ''));
    }

    if (typeof child === 'undefined' || child === null) {
      return [];
    }

    return getRichTextThreadIds(child.children);
  });
