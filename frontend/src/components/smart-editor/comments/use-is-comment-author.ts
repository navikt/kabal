import { StaticDataContext } from '@app/components/app/static-data-context';
import { useContext } from 'react';

export const useIsCommentAuthor = (authorIdent: string): boolean => {
  const { user } = useContext(StaticDataContext);

  return authorIdent === user.navIdent;
};
