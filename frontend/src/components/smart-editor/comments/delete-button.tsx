import { TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useContext, useRef, useState } from 'react';
import { disconnectCommentThread } from '@/components/smart-editor/comments/connect-thread';
import { SmartEditorContext } from '@/components/smart-editor/context';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useMyPlateEditorRef } from '@/plate/types';
import { getDeleteCommentCacheKey, useDeleteCommentOrThreadMutation } from '@/redux-api/smart-editor-comments';

interface DeleteButtonProps {
  id: string;
  title: string;
  className?: string;
}

export const DeleteButton = ({ id, title, className }: DeleteButtonProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const { data: oppgave } = useOppgave();
  const { dokumentId, editingComment, setEditingComment } = useContext(SmartEditorContext);
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentOrThreadMutation({
    fixedCacheKey: getDeleteCommentCacheKey(id),
  });
  const editor = useMyPlateEditorRef();

  if (typeof oppgave === 'undefined') {
    return null;
  }

  const onDelete = () => {
    if (isDeleting) {
      return;
    }

    if (editingComment?.id === id) {
      setEditingComment(null);
    }

    deleteComment({ commentId: id, dokumentId, oppgaveId: oppgave.id }).then(() => {
      if (editor === null) {
        return;
      }

      disconnectCommentThread(editor, id);
    });
  };

  const onCancel = () => {
    setShowConfirm(false);
    // Keep focus inside the comment, so that the comment container's blur handling keeps working.
    deleteButtonRef.current?.focus();
  };

  // The delete button must stay the same element when toggling confirmation, so that it does not lose focus.
  return (
    <>
      <Button
        ref={deleteButtonRef}
        data-color="danger"
        size="xsmall"
        icon={<TrashIcon aria-hidden />}
        variant="primary"
        onClick={showConfirm ? onDelete : () => setShowConfirm(true)}
        loading={showConfirm && isDeleting}
        disabled={!showConfirm && isDeleting}
        title={title}
        className={className}
      />
      {showConfirm ? (
        <Button
          data-color="neutral"
          size="xsmall"
          icon={<XMarkIcon aria-hidden />}
          variant="tertiary"
          onClick={onCancel}
          disabled={isDeleting}
          title="Avbryt"
          className={className}
        />
      ) : null}
    </>
  );
};
