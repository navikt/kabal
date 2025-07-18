import { disconnectCommentThread } from '@app/components/smart-editor/comments/connect-thread';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useMyPlateEditorRef } from '@app/plate/types';
import { useDeleteCommentOrThreadMutation } from '@app/redux-api/smart-editor-comments';
import { TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useContext, useState } from 'react';
import { styled } from 'styled-components';

interface DeleteButtonProps {
  id: string;
  title: string;
}

export const DeleteButton = ({ id, title }: DeleteButtonProps) => {
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
      <AlignLeftButton
        size="xsmall"
        icon={<TrashIcon aria-hidden />}
        variant="danger"
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        title={title}
      />
    );
  }

  return (
    <>
      <AlignLeftButton
        size="xsmall"
        icon={<TrashIcon aria-hidden />}
        variant="danger"
        onClick={onDelete}
        loading={isDeleting}
        title={title}
      />
      <AlignLeftButton
        size="xsmall"
        icon={<XMarkIcon aria-hidden />}
        variant="tertiary"
        onClick={() => setShowConfirm(false)}
        disabled={isDeleting}
        title="Avbryt"
      />
    </>
  );
};

const AlignLeftButton = styled(Button)`
  justify-content: flex-start;
`;
