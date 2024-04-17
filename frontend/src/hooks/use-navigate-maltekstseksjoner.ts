import { useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { isLanguage } from '@app/types/texts/language';

interface PathParams {
  maltekstseksjonId?: string | null;
  maltekstseksjonVersionId?: string | null;
  textId?: string | null;
  lang?: string;
}

export const useNavigateMaltekstseksjoner = () => {
  const oldParams = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();

  return useCallback(
    (newParams: PathParams, replace: boolean = false) =>
      navigate(`${calculateMaltekstseksjonPath(oldParams, newParams)}${search}`, { replace }),
    [navigate, oldParams, search],
  );
};

export const useMaltekstseksjonPath = (newParams: PathParams) => {
  const { search } = useLocation();

  return `${calculateMaltekstseksjonPath(useParams(), newParams)}${search}`;
};

const calculateMaltekstseksjonPath = (oldParams: Record<string, string | undefined>, newParams: PathParams): string => {
  let path = '/maltekstseksjoner';

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

  const lang = newParams.lang !== undefined && isLanguage(newParams.lang) ? newParams.lang : getLang(oldParams);

  if (lang !== undefined) {
    path += `/${lang}`;
  }

  return path;
};

const getLang = ({ lang }: Record<string, string | undefined>): string | undefined =>
  lang !== undefined && isLanguage(lang) ? lang : undefined;
