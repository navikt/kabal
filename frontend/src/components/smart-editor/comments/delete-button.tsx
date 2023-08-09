import { TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useContext, useState } from 'react';
import { disconnectCommentThread } from '@app/components/smart-editor/comments/connect-thread';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useMyPlateEditorRef } from '@app/plate/types';
import { useDeleteCommentOrThreadMutation } from '@app/redux-api/smart-editor-comments';
import { useUser } from '@app/simple-api-state/use-user';
import { useIsCommentAuthor } from './use-is-comment-author';

interface DeleteButtonProps {
  id: string;
  authorIdent: string;
  isFocused: boolean;
  children: string;
  close: () => void;
}

export const DeleteButton = ({ id, authorIdent, isFocused, children, close }: DeleteButtonProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { data: oppgave } = useOppgave();
  const { data: user } = useUser();
  const { documentId } = useContext(SmartEditorContext);
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentOrThreadMutation();
  const isCommentAuthor = useIsCommentAuthor(id, authorIdent);
  const editor = useMyPlateEditorRef();

  if (!isFocused || typeof oppgave === 'undefined' || typeof user === 'undefined' || typeof documentId !== 'string') {
    return null;
  }

  const canDelete = isCommentAuthor || oppgave.tildeltSaksbehandlerident === user.navIdent;

  if (!canDelete) {
    return null;
  }

  const onDelete = () => {
    close();
    deleteComment({ commentId: id, dokumentId: documentId, oppgaveId: oppgave.id }).then(() => {
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
        icon={<TrashIcon aria-hidden />}
        variant="tertiary-neutral"
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
      >
        {children}
      </Button>
    );
  }

  return (
    <>
      <Button
        size="xsmall"
        icon={<XMarkIcon aria-hidden />}
        variant="tertiary"
        onClick={() => setShowConfirm(false)}
        disabled={isDeleting}
      >
        Avbryt
      </Button>
      <Button
        size="xsmall"
        icon={<TrashIcon aria-hidden />}
        variant="tertiary-neutral"
        onClick={onDelete}
        loading={isDeleting}
      >
        {children}
      </Button>
    </>
  );
};
