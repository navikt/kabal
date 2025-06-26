import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { formatEmployeeName } from '@app/domain/employee-name';
import { reduxStore } from '@app/redux/configure-store';
import type { SmartDocumentCommentEvent } from '@app/redux-api/server-sent-events/types';
import { smartEditorCommentsApi } from '@app/redux-api/smart-editor-comments';
import type { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { BodyShort } from '@navikt/ds-react';

export const handleSmartDocumentCommentAddedEvent =
  (oppgaveId: string, userId: string) => (event: SmartDocumentCommentEvent) => {
    reduxStore.dispatch(
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
