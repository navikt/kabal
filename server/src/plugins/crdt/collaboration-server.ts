import { isDeployed } from '@app/config/env';
import { isNotNull } from '@app/functions/guards';
import { parseTokenPayload } from '@app/helpers/token-parser';
import { Level, getLogger } from '@app/logger';
import { getDocument } from '@app/plugins/crdt/api/get-document';
import { setDocument } from '@app/plugins/crdt/api/set-document';
import { ConnectionContext, isConnectionContext } from '@app/plugins/crdt/context';
import { getRedisExtension } from '@app/plugins/crdt/redis';
import { Server } from '@hocuspocus/server';
import { CloseEvent } from '@hocuspocus/common';
import { applyUpdateV2 } from 'yjs';
import { getCacheKey, oboCache } from '@app/auth/cache/cache';
import { ApiClientEnum } from '@app/config/config';

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

const startRefreshOboTokenInterval = (context: ConnectionContext) => {
  const { abortController, cookie } = context;

  if (abortController === undefined) {
    logContext('Missing abort controller', context, 'warn');

    return;
  }

  if (abortController.signal.aborted) {
    logContext('Abort controller already aborted', context, 'warn');

    return;
  }

  if (cookie === undefined) {
    logContext('Missing session cookie', context, 'warn');

    return;
  }

  const timer = setInterval(async () => {
    try {
      // Refresh OBO token directly through Wonderwall.
      const res = await fetch('http://localhost:7564/collaboration/refresh-obo-access-token', {
        method: 'GET',
        headers: { Cookie: cookie },
        signal: abortController.signal,
      });

      if (!res.ok) {
        throw new Error(`Wonderwall responded with status code ${res.status}`);
      }

      logContext('OBO token refreshed', context, 'debug');
    } catch (err) {
      logContext(`Failed to refresh OBO token. ${err instanceof Error ? err : 'Unknown error.'}`, context, 'warn');
    }
  }, 3_000);

  abortController.signal.addEventListener('abort', () => {
    logContext('Aborted refresh OBO token interval', context, 'debug');
    clearInterval(timer);
  });
};

export const collaborationServer = Server.configure({
  debounce: 3_000,
  maxDebounce: 15_000,

  onConnect: async ({ context }) => {
    if (isConnectionContext(context)) {
      // navIdent is not defined when server is run without Wonderwall (ie. locally).
      logContext(`Collaboration connection established for ${context.navIdent}!`, context);

      context.abortController = new AbortController();
      startRefreshOboTokenInterval(context);
    } else {
      log.error({ msg: 'Tried to establish collaboration connection without context' });
      throw new Error('Invalid context');
    }
  },

  onDisconnect: async ({ context }) => {
    if (isConnectionContext(context)) {
      // navIdent is not defined locally.
      logContext(`Collaboration connection closed for ${context.navIdent}!`, context);

      context.abortController?.abort();
    } else {
      log.error({ msg: 'Tried to close collaboration connection without context' });
      throw new Error('Invalid context');
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
        throw getCloseEvent('MISSING_OBO_TOKEN', 4403);
      }
    }

    if (oboAccessToken === null) {
      if (context.cookie === undefined) {
        logContext('Missing session cookie', context, 'warn');
        throw getCloseEvent('MISSING_COOKIE', 4403);
      }

      logContext('Missing OBO token', context, 'warn');
      throw getCloseEvent('MISSING_OBO_TOKEN', 4403);
    }

    const parsedPayload = parseTokenPayload(oboAccessToken);

    if (parsedPayload === undefined) {
      logContext(`Invalid OBO token payload. oboAccessToken: ${oboAccessToken}`, context, 'warn');
      throw getCloseEvent('INVALID_OBO_TOKEN', 4403);
    }

    const { exp } = parsedPayload;
    const now = Math.ceil(Date.now() / 1000);

    if (exp <= now) {
      logContext(`OBO token expired. exp: ${exp}, now: ${now} `, context, 'warn');
      throw getCloseEvent('OBO_TOKEN_EXPIRED', 4403);
    }
  },

  onLoadDocument: async ({ context, document }) => {
    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to load document without context' });
      throw new Error('Invalid context');
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
      throw new Error('Invalid context');
    }

    await setDocument(context, document);

    logContext('Saved document to database', context, 'debug');
  },

  extensions: isDeployed ? [getRedisExtension()].filter(isNotNull) : [],
});

const getCloseEvent = (reason: string, code: number): CloseEvent => ({ reason, code });
