import { PencilIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useUpdateCommentOrReplyMutation } from '@app/redux-api/smart-editor-comments';
import { SmartEditorContext } from '../context/smart-editor-context';
import { useIsCommentAuthor } from './use-is-comment-author';
import { WriteComment } from './write-comment/write-comment';

interface EditButtonProps {
  id: string;
  authorIdent: string;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  isFocused: boolean;
}

export const EditButton = ({ id, authorIdent, isEditing, setIsEditing, isFocused }: EditButtonProps) => {
  const isCommentAuthor = useIsCommentAuthor(id, authorIdent);

  if (!isFocused || !isCommentAuthor) {
    return null;
  }

  const toggleEdit = () => setIsEditing(!isEditing);

  return <Button size="xsmall" icon={<PencilIcon aria-hidden />} variant="secondary" onClick={toggleEdit} />;
};

interface EditCommentProps {
  id: string;
  authorIdent: string;
  close: () => void;
  defaultValue: string;
}

export const EditComment = ({ close, id, authorIdent, defaultValue }: EditCommentProps) => {
  const [editComment, { isLoading }] = useUpdateCommentOrReplyMutation();
  const oppgaveId = useOppgaveId();
  const { documentId } = useContext(SmartEditorContext);
  const isCommentAuthor = useIsCommentAuthor(id, authorIdent);

  if (!isCommentAuthor || typeof oppgaveId !== 'string' || typeof documentId !== 'string') {
    return null;
  }

  const onSubmit = (text: string) =>
    editComment({ commentId: id, text, oppgaveId, dokumentId: documentId }).then(close);

  return (
    <WriteComment
      onSubmit={onSubmit}
      isLoading={isLoading}
      label="Rediger kommentar"
      close={close}
      text={defaultValue}
      primaryButtonLabel="Endre"
    />
  );
};
