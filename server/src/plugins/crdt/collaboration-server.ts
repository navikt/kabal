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
import { getRedisExtension } from '@app/plugins/crdt/redis';
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

const refresh = async (context: ConnectionContext) => {
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

    if (isObject(parsed) && hasOwn(parsed, 'expiresIn') && typeof parsed.expiresIn === 'number') {
      logContext(`OBO token refreshed on interval. Expires in ${parsed.expiresIn} seconds`, context, 'debug');
    } else {
      logContext('Invalid OBO token refresh response', context, 'warn');
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return logContext('OBO token interval refresh request aborted', context, 'debug');
    }

    throw new RefreshError(500, `Failed to refresh OBO token. ${err instanceof Error ? err : 'Unknown error.'}`);
  }
};

const refreshNow = async (context: ConnectionContext) => {
  try {
    await refresh(context);
  } catch (err) {
    logContext(`Failed to refresh OBO token. ${err instanceof Error ? err : 'Unknown error.'}`, context, 'warn');

    if (err instanceof RefreshError) {
      throw getCloseEvent('INVALID_SESSION', 4000 + err.status);
    }

    throw getCloseEvent('INVALID_SESSION', 4500);
  }
};

const startRefreshOboTokenInterval = (context: ConnectionContext) => {
  const { abortController, cookie } = context;

  if (abortController === undefined) {
    return logContext('Missing abort controller', context, 'warn');
  }

  if (abortController.signal.aborted) {
    return logContext('Abort controller already aborted', context, 'warn');
  }

  if (cookie === undefined) {
    return logContext('Missing session cookie', context, 'warn');
  }

  const interval = setInterval(async () => {
    try {
      await refresh(context);
    } catch (err) {
      if (err instanceof RefreshError || err instanceof Error) {
        logContext(err.message, context, 'warn');
      }
      clearInterval(interval);
    }
  }, 30_000);

  abortController.signal.addEventListener('abort', () => {
    logContext('Aborted refresh OBO token interval', context, 'debug');
    clearInterval(interval);
  });
};

export const collaborationServer = Server.configure({
  debounce: 3_000,
  maxDebounce: 15_000,

  onConnect: async ({ context }) => {
    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to establish collaboration connection without context' });
      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }

    // navIdent is not defined when server is run without Wonderwall (ie. locally).
    logContext(`Collaboration connection established for ${context.navIdent}!`, context);

    context.abortController = new AbortController();

    const oboToken = await oboCache.get(getCacheKey(context.navIdent, ApiClientEnum.KABAL_API));

    if (oboToken === null) {
      logContext('Collaboration connection established without OBO token, refreshing OBO token now.', context, 'warn');

      // Refresh OBO token immediately if it's missing or invalid.
      await refreshNow(context);

      return startRefreshOboTokenInterval(context);
    }

    const payload = parseTokenPayload(oboToken);

    if (payload === undefined) {
      logContext(
        'Collaboration connection established with an invalid OBO token, refreshing OBO token now.',
        context,
        'warn',
      );

      // Refresh OBO token immediately if it's invalid.
      await refreshNow(context);

      return startRefreshOboTokenInterval(context);
    }

    const { exp } = payload;
    const expiresIn = exp - Math.ceil(Date.now() / 1_000);

    if (expiresIn <= 120) {
      logContext(
        `Collaboration connection established with OBO token expiring in ${expiresIn} seconds, refreshing OBO token now.`,
        context,
        'warn',
      );

      // Refresh OBO token immediately if it's about to expire.
      await refreshNow(context);

      return startRefreshOboTokenInterval(context);
    }

    logContext(
      `Collaboration connection established with OBO token expiring in ${expiresIn}, starting OBO token refresh interval.`,
      context,
      'warn',
    );
    startRefreshOboTokenInterval(context);
  },

  onDisconnect: async ({ context }) => {
    if (isConnectionContext(context)) {
      // navIdent is not defined locally.
      logContext(`Collaboration connection closed for ${context.navIdent}!`, context);

      context.abortController?.abort();
    } else {
      log.error({ msg: 'Tried to close collaboration connection without context' });
      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }
  },

  beforeHandleMessage: async ({ context }) => {
    if (!isDeployed) {
      return;
    }

    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to handle message without context' });
      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }

    const { navIdent } = context;
    let oboAccessToken = await oboCache.get(getCacheKey(navIdent, ApiClientEnum.KABAL_API));

    if (oboAccessToken === null && context.cookie !== undefined) {
      logContext('Trying to refresh OBO token', context, 'debug');

      try {
        // Refresh OBO token directly through Wonderwall.
        const res = await fetch('http://localhost:7564/collaboration/refresh-obo-access-token', {
          method: 'GET',
          headers: {
            Cookie: context.cookie,
          },
        });

        if (res.ok) {
          oboAccessToken = await oboCache.get(getCacheKey(navIdent, ApiClientEnum.KABAL_API));
          logContext('OBO token refreshed', context, 'debug');
        } else {
          throw new Error(`Wonderwall responded with status code ${res.status}`);
        }
      } catch (err) {
        logContext(`Failed to refresh OBO token. ${err instanceof Error ? err : 'Unknown error.'}`, context, 'warn');
        throw getCloseEvent('MISSING_OBO_TOKEN', 4401);
      }
    }

    if (oboAccessToken === null) {
      if (context.cookie === undefined) {
        logContext('Missing session cookie', context, 'warn');
        throw getCloseEvent('MISSING_COOKIE', 4401);
      }

      logContext('Missing OBO token', context, 'warn');
      throw getCloseEvent('MISSING_OBO_TOKEN', 4401);
    }

    const parsedPayload = parseTokenPayload(oboAccessToken);

    if (parsedPayload === undefined) {
      logContext(`Invalid OBO token payload. oboAccessToken: ${oboAccessToken}`, context, 'warn');
      throw getCloseEvent('INVALID_OBO_TOKEN', 4401);
    }

    const { exp } = parsedPayload;
    const now = Math.ceil(Date.now() / 1000);

    if (exp <= now) {
      logContext(`OBO token expired. exp: ${exp}, now: ${now} `, context, 'warn');
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
      log.error({ msg: 'Tried to store document without context' });
      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }

    await setDocument(context, document);

    logContext('Saved document to database', context, 'debug');
  },

  extensions: isDeployed ? [getRedisExtension()].filter(isNotNull) : [],
});

const getCloseEvent = (reason: string, code: number): CloseEvent => ({ reason, code });

class RefreshError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
