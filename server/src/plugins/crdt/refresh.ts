import { hasOwn, isObject } from '@app/functions/functions';
import { getCloseEvent } from '@app/plugins/crdt/close-event';
import type { ConnectionContext } from '@app/plugins/crdt/context';
import { logContext } from '@app/plugins/crdt/log-context';

const REFRESH_TOKEN_LIMIT = 120; // Highest token expiration time Wonderwall will give new token for.

export const createRefreshTimer = async (context: ConnectionContext, expiresIn: number): Promise<Timer> => {
  if (expiresIn <= REFRESH_TOKEN_LIMIT) {
    try {
      // Refresh OBO token immediately if it's missing or about to expire.
      const newExpiresIn = await refresh(context);
      // Start a new timer to refresh the new token when it expires.
      return createRefreshTimer(context, newExpiresIn);
    } catch (err) {
      logContext(
        `Failed to refresh OBO token for ${context.navIdent}. ${err instanceof Error ? err : 'Unknown error.'}`,
        context,
        'warn',
      );

      if (err instanceof RefreshError) {
        throw getCloseEvent('INVALID_SESSION', 4000 + err.status);
      }

      throw getCloseEvent('INVALID_SESSION', 4500);
    }
  }

  // Refresh OBO token before it expires.
  const timer = setTimeout(
    async () => {
      // Clear previous timer reference.
      context.tokenRefreshTimer = undefined;

      try {
        const newExpiresIn = await refresh(context);
        // Start a new timer to refresh the new token when it expires.
        await createRefreshTimer(context, newExpiresIn);
      } catch (err) {
        if (err instanceof RefreshError || err instanceof Error) {
          logContext(err.message, context, 'warn');
        } else {
          logContext(`Failed to refresh OBO token for ${context.navIdent}. Error: ${err}`, context, 'warn');
        }
      }
    },
    (expiresIn - REFRESH_TOKEN_LIMIT) * 1_000,
  );

  context.tokenRefreshTimer = timer;

  return timer;
};

const refresh = async (context: ConnectionContext, retries = 2): Promise<number> => {
  const { cookie, navIdent } = context;

  logContext(`Refreshing OBO token for ${navIdent}, attempt: ${3 - retries}`, context, 'debug');

  if (cookie === undefined) {
    throw new RefreshError(401, 'Missing session cookie');
  }

  try {
    // Refresh OBO token directly through Wonderwall.
    const res = await fetch('http://localhost:7564/collaboration/refresh-obo-access-token', {
      method: 'GET',
      headers: { Cookie: cookie },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new RefreshError(res.status, `Wonderwall responded with status code ${res.status}: ${text}`);
    }

    const parsed = await res.json();

    if (isObject(parsed) && hasOwn(parsed, 'exp') && typeof parsed.exp === 'number') {
      const expiresIn = Math.floor(parsed.exp - Date.now() / 1_000);

      logContext(`OBO token refreshed for ${navIdent}. Expires in ${expiresIn} seconds`, context, 'debug');

      return expiresIn;
    }

    logContext('Invalid OBO token refresh response', context, 'warn');

    throw new RefreshError(500, 'Invalid OBO token refresh response');
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      logContext('OBO token refresh request aborted', context, 'debug');

      return 0;
    }

    if (retries === 0) {
      throw new RefreshError(500, `Failed to refresh OBO token. ${err instanceof Error ? err : 'Unknown error.'}`);
    }

    return refresh(context, retries - 1);
  }
};

class RefreshError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
