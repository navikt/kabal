import { useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Language } from '@app/types/texts/language';

interface Params {
  id?: string | null;
  versionId?: string | null;
}

export const useNavigateToStandaloneTextVersion = () => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const oldParams = useParams();

  const [, rootPath] = pathname.split('/');

  return useCallback(
    (newParams: Params, replace = false) =>
      navigate(`${calculatePath(rootPath, oldParams, newParams)}${search}`, { replace }),
    [navigate, oldParams, rootPath, search],
  );
};

const calculatePath = (
  rootPath: string | undefined,
  oldParams: Record<string, string | undefined>,
  newParams: Params,
): string => {
  let path = `/${rootPath}`;

  if (newParams.id === null) {
    return path;
  }

  const newId = newParams.id ?? oldParams.id;

  if (newId === undefined) {
    return path;
  }

  const lang = oldParams.lang ?? Language.NB;

  path += `/${newId}/${lang}`;

  const newVersionId = newParams.versionId ?? oldParams.versionId;

  if (newVersionId === undefined) {
    return path;
  }

  path += `/versjoner/${newVersionId}`;

  return path;
};
