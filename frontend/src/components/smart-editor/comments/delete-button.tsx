import { Close, Delete } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React, { useContext, useState } from 'react';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useDeleteCommentOrThreadMutation } from '../../../redux-api/smart-editor-comments';
import { disconnectCommentThread } from '../../rich-text/rich-text-editor/connect-thread';
import { SmartEditorContext } from '../context/smart-editor-context';
import { useIsCommentAuthor } from './use-is-comment-author';

interface DeleteButtonProps {
  id: string;
  authorIdent: string;
  isFocused: boolean;
}

export const DeleteButton = ({ id, authorIdent, isFocused }: DeleteButtonProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const oppgaveId = useOppgaveId();
  const { documentId, editor } = useContext(SmartEditorContext);
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentOrThreadMutation();
  const isCommentAuthor = useIsCommentAuthor(id, authorIdent);

  if (!isFocused || !isCommentAuthor || typeof oppgaveId !== 'string' || typeof documentId !== 'string') {
    return null;
  }

  const onDelete = () => {
    deleteComment({ commentId: id, dokumentId: documentId, oppgaveId }).then(() => {
      if (editor === null) {
        return;
      }

      disconnectCommentThread(editor, id);
    });
  };

  if (!showConfirm) {
    return (
      <Button
        size="xsmall"
        icon={<Delete aria-hidden />}
        variant="danger"
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        title="Slett kommentar"
      />
    );
  }

  return (
    <>
      <Button
        variant="danger"
        title="Bekreft sletting"
        icon={<Delete aria-hidden />}
        loading={isDeleting}
        onClick={onDelete}
        size="xsmall"
      />
      <Button
        size="xsmall"
        icon={<Close aria-hidden />}
        variant="secondary"
        onClick={() => setShowConfirm(false)}
        disabled={isDeleting}
        title="Avbryt sletting"
      />
    </>
  );
};
