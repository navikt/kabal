import { useUser } from '../../../simple-api-state/use-user';

export const useIsCommentAuthor = (commentId: string, authorIdent: string): boolean => {
  const { data: user, isLoading: userIsLoading } = useUser();

  if (userIsLoading || typeof user === 'undefined' || authorIdent !== user.navIdent) {
    return false;
  }

  return true;
};
