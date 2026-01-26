import { disconnectCommentThread } from '@app/components/smart-editor/comments/connect-thread';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useMyPlateEditorRef } from '@app/plate/types';
import { useDeleteCommentOrThreadMutation } from '@app/redux-api/smart-editor-comments';
import { TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useContext, useState } from 'react';

interface DeleteButtonProps {
  id: string;
  title: string;
  className?: string;
}

export const DeleteButton = ({ id, title, className }: DeleteButtonProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { data: oppgave } = useOppgave();
  const { dokumentId } = useContext(SmartEditorContext);
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentOrThreadMutation();
  const editor = useMyPlateEditorRef();

  if (typeof oppgave === 'undefined') {
    return null;
  }

  const onDelete = () => {
    close();
    deleteComment({ commentId: id, dokumentId, oppgaveId: oppgave.id }).then(() => {
      if (editor === null) {
        return;
      }

      disconnectCommentThread(editor, id);
    });
  };

  if (!showConfirm) {
    return (
      <Button
        data-color="danger"
        size="xsmall"
        icon={<TrashIcon aria-hidden />}
        variant="primary"
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        title={title}
        className={className}
      />
    );
  }

  return (
    <>
      <Button
        data-color="danger"
        size="xsmall"
        icon={<TrashIcon aria-hidden />}
        variant="primary"
        onClick={onDelete}
        loading={isDeleting}
        title={title}
        className={className}
      />
      <Button
        data-color="neutral"
        size="xsmall"
        icon={<XMarkIcon aria-hidden />}
        variant="tertiary"
        onClick={() => setShowConfirm(false)}
        disabled={isDeleting}
        title="Avbryt"
        className={className}
      />
    </>
  );
};
