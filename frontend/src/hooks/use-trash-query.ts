import { useSearchParams } from 'react-router-dom';

export const useTrashQuery = (): boolean => {
  const [searchParams] = useSearchParams();

  return searchParams.get('trash') === 'true';
};
