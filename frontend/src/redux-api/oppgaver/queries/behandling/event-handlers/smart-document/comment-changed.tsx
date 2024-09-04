import { BodyShort } from '@navikt/ds-react';
import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { formatEmployeeName } from '@app/domain/employee-name';
import { reduxStore } from '@app/redux/configure-store';
import { SmartDocumentCommentEvent } from '@app/redux-api/server-sent-events/types';
import { smartEditorCommentsApi } from '@app/redux-api/smart-editor-comments';
import { ISmartEditorComment } from '@app/types/smart-editor/comments';

export const handleSmartDocumentCommentChangedEvent =
  (oppgaveId: string, userId: string) => (event: SmartDocumentCommentEvent) => {
    reduxStore.dispatch(
      smartEditorCommentsApi.util.updateQueryData(
        'getComments',
        { oppgaveId, dokumentId: event.documentId },
        (draft) => {
          const { actor, parentId, text } = event;

          if (parentId === null) {
            if (actor.navIdent !== userId) {
              toast.info(
                <InfoToast title={`Kommentar endret av ${formatEmployeeName(actor)}`}>
                  <BodyShort>{text}</BodyShort>
                </InfoToast>,
              );
            }

            // Update comment in list of comments.
            return updateComment(draft, event);
          }

          const parentComment = draft.find((comment) => comment.id === parentId);

          // If parent comment is not found, do nothing.
          if (parentComment === undefined) {
            return draft;
          }

          if (actor.navIdent !== userId) {
            toast.info(
              <InfoToast title={`Svar endret av ${formatEmployeeName(actor)}`}>
                <BodyShort>{text}</BodyShort>
              </InfoToast>,
            );
          }

          // Update reply in parent comment.
          return draft.map((comment) => {
            if (comment.id === parentId) {
              return { ...comment, comments: updateComment(comment.comments, event) };
            }

            return comment;
          });
        },
      ),
    );
  };

const updateComment = (commentList: ISmartEditorComment[], event: SmartDocumentCommentEvent) =>
  commentList.map((comment) => (comment.id === event.commentId ? getUpdatedComment(comment, event) : comment));

const getUpdatedComment = (comment: ISmartEditorComment, event: SmartDocumentCommentEvent) => ({
  ...comment,
  modified: event.timestamp,
  text: event.text,
});
