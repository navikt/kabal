import type { Span } from '@opentelemetry/api';
import { hasOwn, isObject } from '@/functions/functions';
import { withSpan } from '@/helpers/tracing';
import { closeConnection, getCloseEvent } from '@/plugins/crdt/close-event';
import type { ConnectionContext } from '@/plugins/crdt/context';
import { logContext } from '@/plugins/crdt/log-context';

const REFRESH_TOKEN_LIMIT = 120; // Highest token expiration time Wonderwall will give new token for.
const RETRY_INTERVAL_MS = 30_000; // Time between retries when Wonderwall hasn't issued a new token yet.

export const createRefreshTimer = async (context: ConnectionContext, expiresIn: number): Promise<Timer> => {
  if (expiresIn <= REFRESH_TOKEN_LIMIT) {
    try {
      // Refresh access token immediately if it's missing or about to expire.
      return scheduleRefreshTimer(context, getRefreshDelayMs(await refresh(context)));
    } catch (err) {
      logContext(
        `Failed to refresh access token for ${context.navIdent}. ${err instanceof Error ? err : 'Unknown error.'}`,
        context,
        'warn',
      );

      if (err instanceof RefreshError) {
        throw closeConnection(context, 'INVALID_SESSION', 4000 + err.status);
      }

      throw closeConnection(context, 'INVALID_SESSION', 4500);
    }
  }

  return scheduleRefreshTimer(context, getRefreshDelayMs(expiresIn));
};

/** Wonderwall only issues a new token once the current one is close to expiring, so poll until it does. */
const getRefreshDelayMs = (expiresIn: number): number =>
  expiresIn <= REFRESH_TOKEN_LIMIT
    ? Math.min(RETRY_INTERVAL_MS, Math.max(1, expiresIn - 5) * 1_000) // Retry before the token expires, at most RETRY_INTERVAL_MS.
    : (expiresIn - REFRESH_TOKEN_LIMIT) * 1_000; // Schedule to fire when 120s remain.

const scheduleRefreshTimer = (context: ConnectionContext, delayMs: number): Timer => {
  // Refresh access token before it expires.
  const timer = setTimeout(async () => {
    try {
      const newExpiresIn = await refresh(context);
      // Schedule a new timer to refresh the new token when it expires.
      scheduleRefreshTimer(context, getRefreshDelayMs(newExpiresIn));
    } catch (err) {
      // The session is gone. Close with 4401 so the client redirects to login instead of
      // sitting on a connection that can no longer reach the API.
      if (err instanceof RefreshError && err.status === 401) {
        logContext(`Session is no longer valid: ${err.message}`, context, 'warn');

        context.tokenRefreshTimer = undefined;

        const { code, reason } = getCloseEvent('INVALID_SESSION', 4401);
        context.socket.close(code, reason);

        return;
      }

      if (err instanceof RefreshError || err instanceof Error) {
        logContext(err.message, context, 'warn');
      } else {
        logContext(`Failed to refresh access token for ${context.navIdent}. Error: ${err}`, context, 'warn');
      }

      // Don't let the refresh loop die permanently. Retry again instead of leaving the connection
      // without a running refresh timer until the access token eventually expires.
      scheduleRefreshTimer(context, RETRY_INTERVAL_MS);
    }
  }, delayMs);

  // `connected` and `beforeHandleMessage` can both start a timer for the same connection, because
  // hocuspocus replays queued messages before it runs `connected`. Only the last one assigned here
  // is cleared on disconnect, so drop any predecessor instead of leaving it to refresh a connection
  // nobody is tracking anymore. Clearing an already fired timer - the recursive calls above - is a
  // no-op.
  if (context.tokenRefreshTimer !== undefined) {
    clearTimeout(context.tokenRefreshTimer);
  }

  context.tokenRefreshTimer = timer;

  return timer;
};

const refresh = async (context: ConnectionContext, retries = 2): Promise<number> => {
  const { cookie, navIdent } = context;

  logContext(`Refreshing access token for ${navIdent}, attempt: ${3 - retries}`, context, 'debug');

  if (cookie === undefined) {
    throw new RefreshError(401, 'Missing session cookie');
  }

  return withSpan(
    'collaboration.refresh_access_token',
    {
      nav_ident: navIdent,
      attempt: 3 - retries,
      dokument_id: context.dokumentId,
      behandling_id: context.behandlingId,
      tab_id: context.tab_id ?? '',
      client_version: context.client_version,
    },
    async (span) => {
      try {
        const { exp, access_token } = await fetchRefreshedAccessToken(cookie, span);

        context.accessTokenExpiresAt = exp;

        if (access_token !== undefined) {
          context.accessToken = access_token;
        }

        const expiresIn = Math.floor(exp - Date.now() / 1_000);

        logContext(`Access token refreshed for ${navIdent}. Expires in ${expiresIn} seconds`, context, 'debug');

        return expiresIn;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          logContext('Access token refresh request aborted', context, 'debug');

          return 0;
        }

        // Client errors mean the session itself is rejected. Retrying will not help, and the
        // status code has to survive so the caller can close the connection with 4401.
        if (err instanceof RefreshError && err.status >= 400 && err.status < 500) {
          throw err;
        }

        if (retries === 0) {
          throw err instanceof RefreshError
            ? err
            : new RefreshError(500, `Failed to refresh access token. ${err instanceof Error ? err : 'Unknown error.'}`);
        }

        return refresh(context, retries - 1);
      }
    },
  );
};

class RefreshError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface RefreshedAccessToken {
  exp: number;
  access_token: string | undefined;
}

const fetchRefreshedAccessToken = async (cookie: string, span: Span): Promise<RefreshedAccessToken> => {
  // Refresh access token directly through Wonderwall.
  const res = await fetch('http://localhost:7564/collaboration/refresh-access-token', {
    method: 'GET',
    headers: { Cookie: cookie },
    // Wonderwall auto-login redirects to the login page when the session is gone.
    // Following that redirect would turn a dead session into a 200 with an HTML body.
    redirect: 'manual',
  });

  span.setAttribute('http.status_code', res.status);

  if (res.status >= 300 && res.status < 400) {
    throw new RefreshError(401, 'Wonderwall redirected to login. Session is no longer valid.');
  }

  if (!res.ok) {
    const text = await res.text();

    throw new RefreshError(res.status, `Wonderwall responded with status code ${res.status}: ${text}`);
  }

  const parsed = await res.json();

  if (!(isObject(parsed) && hasOwn(parsed, 'exp') && typeof parsed.exp === 'number')) {
    throw new RefreshError(500, 'Invalid access token refresh response');
  }

  const access_token =
    hasOwn(parsed, 'access_token') && typeof parsed.access_token === 'string' ? parsed.access_token : undefined;

  return { exp: parsed.exp, access_token };
};
