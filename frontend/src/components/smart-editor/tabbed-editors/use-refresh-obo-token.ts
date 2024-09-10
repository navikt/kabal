import { addSeconds, format } from 'date-fns';
import { useEffect, useState } from 'react';
import { ISO_DATETIME_FORMAT } from '@app/components/date-picker/constants';
import { pushError, pushLog } from '@app/observability';

type SetIsValid = (isValid: boolean) => void;

export const useRefreshOboToken = (): boolean => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    init(abortController.signal, setIsValid);

    return () => abortController.abort();
  }, []);

  return isValid;
};

const RENEW_THRESHOLD = 120; // Number of seconds before the OBO token expires the refresh request is made.

const init = async (abortSignal: AbortSignal, setIsValid: SetIsValid) => {
  const expiresIn = (await getOboTokenExpiresIn(abortSignal)) ?? 0;

  setIsValid(expiresIn > 0);

  refreshLoop(expiresIn, setIsValid, abortSignal);
};

const refreshLoop = async (refreshInSeconds: number, setIsValid: SetIsValid, abortSignal: AbortSignal, attempt = 1) => {
  if (abortSignal.aborted) {
    return;
  }

  const seconds = refreshInSeconds - RENEW_THRESHOLD;
  const at = format(addSeconds(new Date(), seconds), ISO_DATETIME_FORMAT);

  console.info('Refreshing OBO token in', seconds, 'seconds at', at);

  const timer = setTimeout(async () => {
    const expiresIn = await refreshOboToken(abortSignal);

    if (expiresIn === undefined) {
      console.warn('Could not refresh OBO token. Trying again in', attempt, 'seconds...');

      setIsValid(false);
      refreshLoop(attempt, setIsValid, abortSignal, attempt + 1);

      return;
    }

    setIsValid(expiresIn > 0);
    refreshLoop(expiresIn, setIsValid, abortSignal);
  }, seconds * 1_000);

  abortSignal.addEventListener('abort', () => {
    clearTimeout(timer);
  });
};

const getOboTokenExpiresIn = async (abortSignal: AbortSignal) =>
  getRequest('/collaboration/obo-token-exp', abortSignal);

const refreshOboToken = async (abortSignal: AbortSignal) =>
  getRequest('/collaboration/refresh-obo-access-token', abortSignal);

const getRequest = async (url: string, abortSignal: AbortSignal) => {
  try {
    const res = await fetch(url, { credentials: 'include', signal: abortSignal });

    if (!res.ok) {
      throw new Error(`API responded with error code ${res.status} for ${url}`);
    }

    const data: unknown = await res.json();

    if (!isExpiresIn(data)) {
      throw new Error(`Unexpected response for ${url}`);
    }

    return data.expiresIn;
  } catch (err) {
    if (err instanceof Error) {
      pushError(err);
    } else {
      pushLog(`Request failed. ${url}`);
    }
  }
};

interface ExpiresIn {
  expiresIn: number;
}

const isExpiresIn = (data: unknown): data is ExpiresIn =>
  typeof data === 'object' && data !== null && 'expiresIn' in data;
