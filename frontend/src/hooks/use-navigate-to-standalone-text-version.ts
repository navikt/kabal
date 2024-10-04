import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { Language } from '@app/types/texts/language';

interface Params {
  id?: string | null;
  versionId?: string | null;
  lang?: string;
  trash?: boolean;
}

export const useNavigateToStandaloneTextVersion = (hasLanguage: boolean) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const oldParams = useParams();
  const { lang } = useParams();
  const [searchParams] = useSearchParams();

  const [, rootPath] = pathname.split('/');

  const navigateToText = useCallback(
    (newParams: Params, replace = false) => {
      const path = calculatePath(rootPath, oldParams, newParams, hasLanguage);

      if (newParams.trash === true) {
        searchParams.set('trash', 'true');
      } else if (newParams.trash === false) {
        searchParams.delete('trash');
      }

      return navigate(`${path}?${searchParams.toString()}`, { replace });
    },
    [hasLanguage, navigate, oldParams, rootPath, searchParams],
  );

  useEffect(() => {
    if (lang === undefined && hasLanguage) {
      navigateToText({ lang: Language.NB }, true);
    }
  }, [hasLanguage, lang, navigateToText]);

  return navigateToText;
};

const calculatePath = (
  rootPath: string | undefined,
  oldParams: Record<string, string | undefined>,
  newParams: Params,
  hasLanguage: boolean,
): string => {
  let path = `/${rootPath}`;

  if (hasLanguage) {
    const newLanguage = newParams.lang ?? oldParams.lang ?? Language.NB;

    path += `/${newLanguage}`;
  }

  if (newParams.id === null) {
    return path;
  }

  const newId = newParams.id ?? oldParams.id;

  if (newId === undefined) {
    return path;
  }

  path += `/${newId}`;

  if (newParams.versionId === null) {
    return path;
  }

  const newVersionId = newParams.versionId ?? oldParams.versionId;

  if (newVersionId === undefined) {
    return path;
  }

  path += `/versjoner/${newVersionId}`;

  return path;
};
