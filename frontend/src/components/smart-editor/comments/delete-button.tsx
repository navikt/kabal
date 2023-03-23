import { Close, Delete } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React, { useContext, useState } from 'react';
import { useSlateStatic } from 'slate-react';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useDeleteCommentOrThreadMutation } from '@app/redux-api/smart-editor-comments';
import { useUser } from '@app/simple-api-state/use-user';
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
  const { data: oppgave } = useOppgave();
  const { data: user } = useUser();
  const { documentId } = useContext(SmartEditorContext);
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentOrThreadMutation();
  const isCommentAuthor = useIsCommentAuthor(id, authorIdent);
  const editor = useSlateStatic();

  if (!isFocused || typeof oppgave === 'undefined' || typeof user === 'undefined' || typeof documentId !== 'string') {
    return null;
  }

  const canDelete = isCommentAuthor || oppgave.tildeltSaksbehandler?.navIdent === user.navIdent;

  if (!canDelete) {
    return null;
  }

  const onDelete = () => {
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
