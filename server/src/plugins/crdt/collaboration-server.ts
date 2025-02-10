import { getCacheKey, oboCache } from '@app/auth/cache/cache';
import { ApiClientEnum } from '@app/config/config';
import { isDeployed } from '@app/config/env';
import { isNotNull } from '@app/functions/guards';
import { parseTokenPayload } from '@app/helpers/token-parser';
import { type Level, getLogger } from '@app/logger';
import { getDocument } from '@app/plugins/crdt/api/get-document';
import { setDocument } from '@app/plugins/crdt/api/set-document';
import { type ConnectionContext, isConnectionContext } from '@app/plugins/crdt/context';
import { hasOwn, isObject } from '@app/plugins/crdt/functions';
import { getValkeyExtension } from '@app/plugins/crdt/valkey';
import type { CloseEvent } from '@hocuspocus/common';
import { Server } from '@hocuspocus/server';
import { applyUpdateV2 } from 'yjs';

const log = getLogger('collaboration');

const logContext = (msg: string, context: ConnectionContext, level: Level = 'info') => {
  log[level]({
    msg,
    trace_id: context.trace_id,
    span_id: context.span_id,
    tab_id: context.tab_id,
    client_version: context.client_version,
    data: { behandlingId: context.behandlingId, dokumentId: context.dokumentId },
  });
};

const refresh = async (context: ConnectionContext, retries = 2): Promise<number> => {
  const { abortController, cookie } = context;

  if (abortController === undefined) {
    throw new RefreshError(500, 'Missing abort controller');
  }

  if (cookie === undefined) {
    throw new RefreshError(401, 'Missing session cookie');
  }

  try {
    // Refresh OBO token directly through Wonderwall.
    const res = await fetch('http://localhost:7564/collaboration/refresh-obo-access-token', {
      method: 'GET',
      headers: { Cookie: cookie },
      signal: abortController.signal,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new RefreshError(res.status, `Wonderwall responded with status code ${res.status}: ${text}`);
    }

    const parsed = await res.json();

    if (isObject(parsed) && hasOwn(parsed, 'exp') && typeof parsed.exp === 'number') {
      const expiresIn = Math.floor(parsed.exp - Date.now() / 1_000);

      logContext(`OBO token refreshed. Expires in ${expiresIn} seconds`, context, 'debug');

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

const REFRESH_TOKEN_LIMIT = 120; // Highest token expiration time Wonderwall will give new token for.

const createRefreshTimeout = async (context: ConnectionContext, expiresIn: number): Promise<void> => {
  if (expiresIn <= REFRESH_TOKEN_LIMIT) {
    try {
      // Refresh OBO token immediately if it's missing or about to expire.
      const newExpiresIn = await refresh(context);
      // Start a new timeout to refresh the new token when it expires.
      return createRefreshTimeout(context, newExpiresIn);
    } catch (err) {
      logContext(`Failed to refresh OBO token. ${err instanceof Error ? err : 'Unknown error.'}`, context, 'warn');

      if (err instanceof RefreshError) {
        throw getCloseEvent('INVALID_SESSION', 4000 + err.status);
      }

      throw getCloseEvent('INVALID_SESSION', 4500);
    }
  }

  // Refresh OBO token 30 seconds before it expires.
  const timeout = setTimeout(
    async () => {
      // Clear previous timeout reference.
      context.timeout = undefined;

      try {
        const newExpiresIn = await refresh(context);
        // Start a new timeout to refresh the new token when it expires.
        createRefreshTimeout(context, newExpiresIn);
      } catch (err) {
        if (err instanceof RefreshError || err instanceof Error) {
          logContext(err.message, context, 'warn');
        } else {
          logContext(`Failed to refresh OBO token. Error: ${err}`, context, 'warn');
        }
      }
    },
    (expiresIn - REFRESH_TOKEN_LIMIT) * 1_000,
  );

  context.timeout = timeout;

  const abortController = new AbortController();

  abortController.signal.addEventListener('abort', () => {
    logContext('Aborted refresh OBO token timeout', context, 'debug');
    clearTimeout(timeout);
    context.timeout = undefined;
  });

  context.abortController = abortController;
};

export const collaborationServer = Server.configure({
  debounce: 3_000,
  maxDebounce: 15_000,

  onConnect: async ({ context }) => {
    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to establish collaboration connection without context' });
      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }

    const expiresIn = await getTokenExpiresIn(context, 'onConnect');

    // navIdent is not defined when server is run without Wonderwall (ie. locally).
    logContext(
      `Collaboration connection established for ${context.navIdent} with token expiring in ${expiresIn} seconds.`,
      context,
      'debug',
    );

    createRefreshTimeout(context, expiresIn);
  },

  onDisconnect: ({ context }) => {
    if (isConnectionContext(context)) {
      // navIdent is not defined locally.
      logContext(`Collaboration connection closed for ${context.navIdent}.`, context, 'debug');

      context.abortController?.abort();

      return Promise.resolve();
    }

    log.error({ msg: 'Tried to close collaboration connection without context' });
    throw getCloseEvent('INVALID_CONTEXT', 4401);
  },

  beforeHandleMessage: async ({ context }) => {
    if (!isDeployed) {
      return;
    }

    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to handle message without context' });
      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }

    if (context.cookie === undefined) {
      logContext('Missing session cookie', context, 'warn');
      throw getCloseEvent('MISSING_COOKIE', 4401);
    }

    if (context.timeout === undefined) {
      const expiresIn = await getTokenExpiresIn(context, 'beforeHandleMessage');
      logContext('Missing refresh OBO token timeout. Starting timeout.', context, 'warn');
      await createRefreshTimeout(context, expiresIn);
    }

    const expiresIn = await getTokenExpiresIn(context, 'beforeHandleMessage');

    if (expiresIn <= 0) {
      logContext(`OBO token expired ${expiresIn} seconds ago.`, context, 'warn');
      throw getCloseEvent('OBO_TOKEN_EXPIRED', 4401);
    }
  },

  onLoadDocument: async ({ context, document }) => {
    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to load document without context' });
      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }

    if (!document.isEmpty('content')) {
      logContext('Document already loaded', context);

      return document;
    }

    const res = await getDocument(context);

    logContext('Loaded state/update', context, 'debug');

    const update = new Uint8Array(Buffer.from(res.data, 'base64url'));

    applyUpdateV2(document, update);

    logContext('Loaded state/update applied', context, 'debug');
  },

  onStoreDocument: async ({ context, document }) => {
    if (!isConnectionContext(context)) {
      log.error({
        msg: 'Tried to store document without context',
        data: { ...context, cookie: undefined, abortController: undefined, timeout: undefined },
      });

      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }

    await setDocument(context, document);

    logContext('Saved document to database', context, 'debug');
  },

  extensions: isDeployed ? [getValkeyExtension()].filter(isNotNull) : [],
});

const getCloseEvent = (reason: string, code: number): CloseEvent => ({ reason, code });

class RefreshError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const getTokenExpiresIn = async (context: ConnectionContext, method: string) => {
  const oboAccessToken = await oboCache.get(getCacheKey(context.navIdent, ApiClientEnum.KABAL_API));

  if (oboAccessToken === null) {
    logContext(`Missing OBO token: ${method}`, context, 'warn');

    return 0;
  }

  const payload = parseTokenPayload(oboAccessToken);

  if (payload === undefined) {
    logContext(`Invalid OBO token payload: ${method}`, context, 'warn');

    return 0;
  }

  return Math.floor(payload.exp - Date.now() / 1_000);
};
