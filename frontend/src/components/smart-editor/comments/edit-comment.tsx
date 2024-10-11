import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useUpdateCommentOrReplyMutation } from '@app/redux-api/smart-editor-comments';
import { PencilIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useContext } from 'react';
import { styled } from 'styled-components';
import { useIsCommentAuthor } from './use-is-comment-author';
import { WriteComment } from './write-comment/write-comment';

interface EditButtonProps {
  authorIdent: string;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  isFocused: boolean;
  close: () => void;
}

export const EditButton = ({ authorIdent, isEditing, setIsEditing, isFocused, close }: EditButtonProps) => {
  const isCommentAuthor = useIsCommentAuthor(authorIdent);

  if (!isFocused || !isCommentAuthor) {
    return null;
  }

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    close();
  };

  return (
    <AlignLeftButton size="xsmall" icon={<PencilIcon aria-hidden />} variant="tertiary" onClick={toggleEdit}>
      Endre
    </AlignLeftButton>
  );
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
  const { dokumentId } = useContext(SmartEditorContext);
  const isCommentAuthor = useIsCommentAuthor(authorIdent);

  if (!isCommentAuthor || typeof oppgaveId !== 'string') {
    return null;
  }

  const onSubmit = (text: string) => editComment({ commentId: id, text, oppgaveId, dokumentId }).then(close);

  return (
    <WriteComment
      onSubmit={onSubmit}
      isLoading={isLoading}
      label="Rediger kommentar"
      close={close}
      text={defaultValue}
      primaryButtonLabel="Endre"
      autoFocus
    />
  );
};

const AlignLeftButton = styled(Button)`
  justify-content: flex-start;
`;
