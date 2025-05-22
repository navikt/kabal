import { PencilIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { useIsCommentAuthor } from './use-is-comment-author';

interface EditButtonProps {
  authorIdent: string;
  isEditing: boolean;
  setIsEditing: () => void;
  isFocused: boolean;
}

export const EditButton = ({ authorIdent, isEditing, setIsEditing, isFocused }: EditButtonProps) => {
  const isCommentAuthor = useIsCommentAuthor(authorIdent);

  if (isEditing || !(isFocused && isCommentAuthor)) {
    return null;
  }

  const toggleEdit = () => {
    setIsEditing();
  };

  return (
    <AlignLeftButton size="xsmall" icon={<PencilIcon aria-hidden />} variant="tertiary" onClick={toggleEdit}>
      Endre
    </AlignLeftButton>
  );
};

const AlignLeftButton = styled(Button)`
  justify-content: flex-start;
`;
