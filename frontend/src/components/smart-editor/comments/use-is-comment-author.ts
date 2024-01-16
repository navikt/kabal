import { useContext } from 'react';
import { UserContext } from '@app/components/app/user';

export const useIsCommentAuthor = (commentId: string, authorIdent: string): boolean => {
  const user = useContext(UserContext);

  return authorIdent === user.navIdent;
};
