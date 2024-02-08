import { useContext } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';

export const useIsCommentAuthor = (commentId: string, authorIdent: string): boolean => {
  const { user } = useContext(StaticDataContext);

  return authorIdent === user.navIdent;
};
