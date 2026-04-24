import { BodyShort } from '@navikt/ds-react';
import { InfoToast } from '@/components/toast/info-toast';
import { toast } from '@/components/toast/store';
import { formatEmployeeName } from '@/domain/employee-name';
import type { SmartDocumentCommentEvent } from '@/redux-api/server-sent-events/types';
import { smartEditorCommentsApi } from '@/redux-api/smart-editor-comments';
import type { Dispatch } from '@/redux-api/types';
import type { ISmartEditorComment } from '@/types/smart-editor/comments';

export const handleSmartDocumentCommentAddedEvent =
  (oppgaveId: string, userId: string, dispatch: Dispatch) => (event: SmartDocumentCommentEvent) => {
    dispatch(
      smartEditorCommentsApi.util.updateQueryData(
        'getComments',
        { oppgaveId, dokumentId: event.documentId },
        (draft) => {
          const { actor, text, parentId } = event;

          if (parentId === null) {
            // If comment already exists, do nothing.
            if (draft.some((comment) => comment.id === event.commentId)) {
              return draft;
            }

            if (actor.navIdent !== userId) {
              toast.info(
                <InfoToast title={`Ny kommentar fra ${formatEmployeeName(actor)}`}>
                  <BodyShort>{text}</BodyShort>
                </InfoToast>,
              );
            }

            // Add new comment to list of comments.
            return [...draft, commentEventToComment(event)].toSorted((a, b) => a.created.localeCompare(b.created));
          }

          const parentComment = draft.find((comment) => comment.id === parentId);

          // If parent comment is not found or reply already exists, do nothing.
          if (parentComment === undefined || parentComment.comments.some((reply) => reply.id === event.commentId)) {
            return draft;
          }

          if (actor.navIdent !== userId) {
            toast.info(
              <InfoToast title={`Nytt svar fra ${formatEmployeeName(actor)}`}>
                <BodyShort>{text}</BodyShort>
              </InfoToast>,
            );
          }

          // Add new reply to parent comment.
          parentComment.comments = [...parentComment.comments, commentEventToComment(event)].toSorted((a, b) =>
            a.created.localeCompare(b.created),
          );
        },
      ),
    );
  };

const commentEventToComment = (event: SmartDocumentCommentEvent): ISmartEditorComment => ({
  id: event.commentId,
  text: event.text,
  author: {
    ident: event.author.navIdent,
    name: event.author.navn,
  },
  comments: [],
  created: event.timestamp,
  modified: event.timestamp,
});
