import { ENVIRONMENT } from '@/environment';
import { hasOwn, isObject } from '@/functions/object';

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Checks the login proxy (Wonderwall) session.
 * Returns `UNKNOWN` on network errors and unexpected responses, so callers can fall back to their default behaviour.
 */
export const getSessionStatus = async (signal?: AbortSignal): Promise<SessionStatus> => {
  try {
    const res = await fetch('/oauth2/session', { credentials: 'include', signal });

    if (res.status === 401) {
      return SessionStatus.INACTIVE;
    }

    if (!res.ok) {
      return SessionStatus.UNKNOWN;
    }

    const data: unknown = await res.json();

    if (
      isObject(data) &&
      hasOwn(data, 'session') &&
      isObject(data.session) &&
      hasOwn(data.session, 'active') &&
      typeof data.session.active === 'boolean'
    ) {
      return data.session.active ? SessionStatus.ACTIVE : SessionStatus.INACTIVE;
    }

    return SessionStatus.UNKNOWN;
  } catch {
    return SessionStatus.UNKNOWN;
  }
};

interface RetryOptions {
  signal: AbortSignal;
  baseDelayMs?: number;
  maxDelayMs?: number;
  /** `attempt` is 0-based. */
  onRetry?: (attempt: number, delayMs: number) => void;
}

/**
 * Like `getSessionStatus`, but retries `UNKNOWN` with exponential backoff until the status is known.
 * Returns `null` if aborted.
 */
export const getSessionStatusWithRetry = async ({
  signal,
  baseDelayMs = 1_000,
  maxDelayMs = 30_000,
  onRetry,
}: RetryOptions): Promise<SessionStatus.ACTIVE | SessionStatus.INACTIVE | null> => {
  for (let attempt = 0; !signal.aborted; attempt++) {
    const status = await getSessionStatus(signal);

    if (signal.aborted) {
      return null;
    }

    if (status !== SessionStatus.UNKNOWN) {
      return status;
    }

    const delayMs = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);

    onRetry?.(attempt, delayMs);

    await sleep(delayMs, signal);
  }

  return null;
};

/** Resolves after `ms`, or immediately when `signal` is aborted. */
export const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    if (signal.aborted) {
      return resolve();
    }

    const onAbort = () => {
      clearTimeout(timeout);
      resolve();
    };

    const timeout = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    signal.addEventListener('abort', onAbort, { once: true });
  });

export const redirectToLogin = () => {
  if (ENVIRONMENT.isLocal) {
    return;
  }

  const redirect = `${window.location.pathname}${window.location.search}`;

  window.location.assign(`/oauth2/login?redirect=${encodeURIComponent(redirect)}`);
};
