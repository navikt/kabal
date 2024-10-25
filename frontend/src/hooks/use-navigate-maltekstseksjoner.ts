import { Language } from '@app/types/texts/language';
import { useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

interface PathParams {
  maltekstseksjonId?: string | null;
  maltekstseksjonVersionId?: string | null;
  textId?: string | null;
  lang?: Language | null;
}

export const useNavigateMaltekstseksjoner = () => {
  const oldParams = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return useCallback(
    (newParams: PathParams, replace = false) => {
      const path = calculateMaltekstseksjonPath(oldParams, newParams);

      return navigate(`${path}?${searchParams.toString()}`, { replace });
    },
    [navigate, oldParams, searchParams],
  );
};

export const useMaltekstseksjonPath = (newParams: PathParams) => {
  const { search } = useLocation();

  return `${calculateMaltekstseksjonPath(useParams(), newParams)}${search}`;
};

const calculateMaltekstseksjonPath = (oldParams: Record<string, string | undefined>, newParams: PathParams): string => {
  let path = '/maltekstseksjoner';

  const language = newParams.lang ?? oldParams.lang ?? Language.NB;

  path += `/${language}`;

  if (newParams.maltekstseksjonId === null) {
    return path;
  }

  const maltekstseksjonId = newParams.maltekstseksjonId ?? oldParams.id;

  if (maltekstseksjonId !== undefined) {
    path += `/${maltekstseksjonId}`;
  }

  if (newParams.maltekstseksjonVersionId === null) {
    return path;
  }

  const maltekstseksjonVersionId = newParams.maltekstseksjonVersionId ?? oldParams.maltekstseksjonVersionId;

  if (maltekstseksjonVersionId !== undefined) {
    path += `/versjoner/${maltekstseksjonVersionId}`;
  }

  if (newParams.textId === null) {
    return path;
  }

  const textId = newParams.textId ?? oldParams.textId;

  if (textId !== undefined) {
    path += `/tekster/${textId}`;
  }

  return path;
};
