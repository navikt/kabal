import { reduxStore } from '@app/redux/configure-store';
import type { SmartDocumentCommentEvent } from '@app/redux-api/server-sent-events/types';
import { smartEditorCommentsApi } from '@app/redux-api/smart-editor-comments';

export const handleSmartDocumentCommentRemovedEvent = (oppgaveId: string) => (event: SmartDocumentCommentEvent) => {
  reduxStore.dispatch(
    smartEditorCommentsApi.util.updateQueryData('getComments', { oppgaveId, dokumentId: event.documentId }, (draft) => {
      const { parentId, commentId } = event;

      if (parentId === null) {
        // Remove comment from list of comments.
        return draft.filter((comment) => comment.id !== commentId);
      }

      // Remove reply from parent comment.
      return draft.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            comments: comment.comments.filter((reply) => reply.id !== commentId),
          };
        }

        return comment;
      });
    }),
  );
};
