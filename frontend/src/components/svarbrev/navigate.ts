import { useCallback } from 'react';
import { useNavigate } from 'react-router';

export const useSvarbrevNavigate = () => {
  const navigate = useNavigate();

  return useCallback(
    (pathname: string) => navigate({ pathname, search: window.location.search, hash: window.location.hash }),
    [navigate],
  );
};
