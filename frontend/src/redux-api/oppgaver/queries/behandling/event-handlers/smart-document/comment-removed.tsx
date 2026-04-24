import type { SmartDocumentCommentEvent } from '@/redux-api/server-sent-events/types';
import { smartEditorCommentsApi } from '@/redux-api/smart-editor-comments';
import type { Dispatch } from '@/redux-api/types';

export const handleSmartDocumentCommentRemovedEvent =
  (oppgaveId: string, dispatch: Dispatch) => (event: SmartDocumentCommentEvent) => {
    dispatch(
      smartEditorCommentsApi.util.updateQueryData(
        'getComments',
        { oppgaveId, dokumentId: event.documentId },
        (draft) => {
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
        },
      ),
    );
  };
