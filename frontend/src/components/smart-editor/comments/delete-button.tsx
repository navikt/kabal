import { TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useContext, useState } from 'react';
import { styled } from 'styled-components';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { disconnectCommentThread } from '@app/components/smart-editor/comments/connect-thread';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useMyPlateEditorRef } from '@app/plate/types';
import { useDeleteCommentOrThreadMutation } from '@app/redux-api/smart-editor-comments';
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
  const { user } = useContext(StaticDataContext);
  const { documentId } = useContext(SmartEditorContext);
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentOrThreadMutation();
  const isCommentAuthor = useIsCommentAuthor(id, authorIdent);
  const editor = useMyPlateEditorRef();

  if (!isFocused || typeof oppgave === 'undefined' || typeof documentId !== 'string') {
    return null;
  }

  const canDelete = isCommentAuthor || oppgave.saksbehandler?.navIdent === user.navIdent;

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
      <AlignLeftButton
        size="xsmall"
        icon={<TrashIcon aria-hidden />}
        variant="tertiary-neutral"
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
      >
        {children}
      </AlignLeftButton>
    );
  }

  return (
    <>
      <AlignLeftButton
        size="xsmall"
        icon={<XMarkIcon aria-hidden />}
        variant="tertiary"
        onClick={() => setShowConfirm(false)}
        disabled={isDeleting}
      >
        Avbryt
      </AlignLeftButton>
      <AlignLeftButton
        size="xsmall"
        icon={<TrashIcon aria-hidden />}
        variant="tertiary-neutral"
        onClick={onDelete}
        loading={isDeleting}
      >
        {children}
      </AlignLeftButton>
    </>
  );
};

const AlignLeftButton = styled(Button)`
  justify-content: flex-start;
`;
