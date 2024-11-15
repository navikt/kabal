import { TEXT_TYPE_BASE_PATH } from '@app/domain/redaktør-paths';
import { REGELVERK_TYPE, type TextTypes } from '@app/types/common-text-types';
import { Language } from '@app/types/texts/language';
import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

interface Params {
  id?: string | null;
  versionId?: string | null;
  lang?: string;
}

export const useNavigateToStandaloneTextVersion = (textType: TextTypes) => {
  const hasLanguage = textType !== REGELVERK_TYPE;
  const navigate = useNavigate();
  const oldParams = useParams();
  const { lang } = useParams();
  const [searchParams] = useSearchParams();

  const navigateToText = useCallback(
    (newParams: Params, replace = false) => {
      const path = calculatePath(textType, oldParams, newParams, hasLanguage);

      return navigate(`${path}?${searchParams.toString()}`, { replace });
    },
    [hasLanguage, navigate, oldParams, textType, searchParams],
  );

  useEffect(() => {
    if (lang === undefined && hasLanguage) {
      navigateToText({ lang: Language.NB }, true);
    }
  }, [hasLanguage, lang, navigateToText]);

  return navigateToText;
};

const calculatePath = (
  textType: TextTypes,
  oldParams: Record<string, string | undefined>,
  newParams: Params,
  hasLanguage: boolean,
): string => {
  let path = `/${TEXT_TYPE_BASE_PATH[textType]}`;

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
