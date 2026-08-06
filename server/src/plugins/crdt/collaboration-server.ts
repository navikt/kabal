import { Hocuspocus } from '@hocuspocus/server';
import { validateToken } from '@navikt/oasis';
import { applyUpdateV2 } from 'yjs';
import { isDeployed } from '@/config/env';
import { SMART_DOCUMENT_WRITE_ACCESS } from '@/document-access/service';
import { isNotNull } from '@/functions/guards';
import { stripBearer } from '@/headers';
import { withSpan } from '@/helpers/tracing';
import { getTeamLogger } from '@/logger';
import { getDocument } from '@/plugins/crdt/api/get-document';
import { getDocumentJson, isResponseError, setDocument } from '@/plugins/crdt/api/set-document';
import { closeConnection, getCloseEvent, isCloseEvent } from '@/plugins/crdt/close-event';
import { type ConnectionContext, isConnectionContext } from '@/plugins/crdt/context';
import { DEBOUNCE_MS, endActivity, trackActivity, withCollaborationSpan } from '@/plugins/crdt/crdt-tracing';
import { log, logContext } from '@/plugins/crdt/log-context';
import { createRefreshTimer } from '@/plugins/crdt/refresh';
import { sendStateless } from '@/plugins/crdt/send-stateless';
import { getValkeyExtension } from '@/plugins/crdt/valkey';

const teamLog = getTeamLogger('collaboration');

export const collaborationServer = new Hocuspocus({
  name: 'kabal-collaboration-server',
  // Idle connections are only kept alive by awareness updates (~every 15s) in hocuspocus v4 -
  // must exceed that interval with margin, or authenticated-but-idle clients get closed with 4408.
  timeout: 60_000,
  debounce: DEBOUNCE_MS,
  maxDebounce: 15_000,

  onAuthenticate: async ({ context, connectionConfig }) => {
    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to authenticate collaboration connection without context' });
      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }

    return withCollaborationSpan('onAuthenticate', context, async (span) => {
      const { dokumentId, navIdent, behandlingId } = context;

      const hasWriteAccess = await getHasWriteAccess(context, true);

      context.hasWriteAccess = hasWriteAccess;

      connectionConfig.readOnly = !hasWriteAccess;

      span.setAttribute('collaboration.has_write_access', hasWriteAccess);

      logContext(
        `Authenticated collaboration socket for ${dokumentId} in ${behandlingId} for user ${navIdent} ${hasWriteAccess ? 'User has write access' : 'User does not have write access'}.`,
        context,
        'debug',
      );
    });
  },

  onConnect: async ({ context, connectionConfig, requestHeaders }) => {
    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to establish collaboration connection without context' });
      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }

    return withCollaborationSpan('onConnect', context, async (span) => {
      const expiresIn = await setAccessToken(context, requestHeaders);

      span.setAttribute('collaboration.token_expires_in', expiresIn);

      // navIdent is not defined when server is run without Wonderwall (ie. locally).
      logContext(
        `Collaboration connection established for ${context.navIdent} with token expiring in ${expiresIn} seconds.`,
        context,
        'debug',
      );

      const { dokumentId, navIdent, behandlingId } = context;

      const hasWriteAccess = await getHasWriteAccess(context, true);

      connectionConfig.readOnly = !hasWriteAccess;

      span.setAttribute('collaboration.has_write_access', hasWriteAccess);

      logContext(
        `Connected collaboration socket for ${dokumentId} in ${behandlingId} for user ${navIdent}. ${hasWriteAccess ? 'User has write access' : 'User does not have write access'}.`,
        context,
        'debug',
      );
    });
  },

  connected: async ({ context, connection, documentName }) => {
    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to establish collaboration connection without context' });
      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }

    return withCollaborationSpan('connected', context, async () => {
      logContext('New collaboration connection established', context, 'debug');

      // hocuspocus replaces the context object after both `onConnect` and `onAuthenticate`
      // (`hookPayload.context = { ...hookPayload.context, ...contextAdditions }`). A timer started in
      // either of those hooks would keep writing the refreshed expiry to a discarded copy, leaving
      // `beforeHandleMessage` to read the expiry copied at connect time and close the connection once
      // the first token expires. `connected` runs after the last replacement.
      await createRefreshTimer(context, getAccessTokenExpiresIn(context));

      const { navIdent, tab_id, client_version } = context;

      context.removeHasAccessListener = SMART_DOCUMENT_WRITE_ACCESS.addHasAccessListener(
        documentName,
        navIdent,
        { tab_id, client_version },
        (hasWriteAccess) => {
          sendStateless(connection, hasWriteAccess ? 'read-write' : 'readonly');
          connection.readOnly = !hasWriteAccess;
        },
      );

      context.removeDeletedListener = SMART_DOCUMENT_WRITE_ACCESS.addDeletedDocumentListener(documentName, () => {
        logContext(`Document deleted and closed "${documentName}"`, context, 'info');
        sendStateless(connection, 'deleted');
        closeConnection(context, 'DOCUMENT_DELETED', 4410);
      });
    });
  },

  onDisconnect: async ({ context }) => {
    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to close collaboration connection without context' });
      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }

    endActivity(context);

    return withCollaborationSpan('onDisconnect', context, async () => {
      // navIdent is not defined locally.
      logContext(`Collaboration connection closed for ${context.navIdent}.`, context, 'debug');

      if (context.tokenRefreshTimer !== undefined) {
        clearTimeout(context.tokenRefreshTimer);
        context.tokenRefreshTimer = undefined;
        logContext('Access token refresh timer cleared', context, 'debug');
      }

      context.removeHasAccessListener?.();
      context.removeDeletedListener?.();
    });
  },

  beforeHandleMessage: async ({ context, connection }) => {
    if (!isDeployed) {
      return;
    }

    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to handle message without context' });
      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }

    if (context.cookie === undefined) {
      logContext('Missing session cookie', context, 'warn');
      throw closeConnection(context, 'MISSING_COOKIE', 4401);
    }

    // hocuspocus replays queued messages just before running `connected`, and the client sends sync
    // step 1 immediately, so in practice this branch - not `connected` - is what starts the timer on
    // a normal connection. It also covers the case where the refresh loop cleared the timer itself
    // after Wonderwall rejected the session. Neither is an anomaly, hence debug.
    if (context.tokenRefreshTimer === undefined) {
      logContext('Access token refresh timer not running. Starting timer.', context, 'debug');
      await createRefreshTimer(context, getAccessTokenExpiresIn(context));
    }

    const expiresIn = getAccessTokenExpiresIn(context);

    if (expiresIn <= 0) {
      return withCollaborationSpan('beforeHandleMessage', context, async (span) => {
        span.setAttribute('token_expires_in', expiresIn);
        logContext(`Access token expired ${Math.abs(expiresIn)} seconds ago.`, context, 'warn');
        throw closeConnection(context, 'ACCESS_TOKEN_EXPIRED', 4401);
      });
    }

    const hasWriteAccess = await getHasWriteAccess(context);
    connection.readOnly = !hasWriteAccess;
  },

  onChange: async ({ context }) => {
    if (!isConnectionContext(context)) {
      return;
    }

    const hasWriteAccess = await getHasWriteAccess(context);

    trackActivity(context, getAccessTokenExpiresIn(context), hasWriteAccess);
  },

  beforeUnloadDocument: async ({ documentName }) => {
    return withSpan('collaboration.beforeUnloadDocument', { dokument_id: documentName }, async () => {
      log.debug({ msg: `Before unload document: ${documentName}`, data: { dokumentId: documentName } });
    });
  },

  onLoadDocument: async ({ context, document, connectionConfig }) => {
    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to load document without context' });
      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }

    return withCollaborationSpan('onLoadDocument', context, async (span) => {
      const { dokumentId, navIdent } = context;

      const hasWriteAccess = await getHasWriteAccess(context, true);

      span.setAttribute('collaboration.has_write_access', hasWriteAccess);

      if (!document.isEmpty('content')) {
        span.setAttribute('collaboration.document_already_loaded', true);

        logContext(
          `Document ${dokumentId} already loaded for user ${navIdent}. User ${hasWriteAccess ? 'has' : 'does not have'} write access.`,
          context,
          'debug',
        );

        connectionConfig.readOnly = !hasWriteAccess;

        return document;
      }

      span.setAttribute('collaboration.document_already_loaded', false);

      const res = await getDocument(context);

      logContext('Loaded state/update', context, 'debug');

      const update = new Uint8Array(Buffer.from(res.data, 'base64url'));

      applyUpdateV2(document, update);

      logContext('Loaded state/update applied', context, 'debug');

      connectionConfig.readOnly = !hasWriteAccess;

      logContext(
        `Document ${dokumentId} loaded for user ${navIdent}. User ${hasWriteAccess ? 'has' : 'does not have'} write access.`,
        context,
        'debug',
      );
    });
  },

  afterLoadDocument: async ({ context }) => {
    if (!isConnectionContext(context)) {
      return;
    }

    return withCollaborationSpan('afterLoadDocument', context, async () => {
      logContext('After load document', context, 'debug');
    });
  },

  onStoreDocument: async ({ lastContext, document }) => {
    if (!isConnectionContext(lastContext)) {
      log.error({ msg: 'Tried to store document without context' });

      teamLog.debug({
        msg: 'Tried to store document without context',
        data: {
          document: JSON.stringify(getDocumentJson(document)),
          context: JSON.stringify({
            ...lastContext,
            abortController: undefined,
            accessToken: undefined,
            cookie: undefined,
            hasAbortController: !!lastContext.hasAbortController,
            accessTokenLength: lastContext.accessToken?.length ?? 'undefined',
            cookieLength: lastContext.cookie?.length ?? 'undefined',
          }),
        },
      });

      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }

    return withCollaborationSpan('onStoreDocument', lastContext, async () => {
      try {
        await setDocument(lastContext, document);

        logContext('Saved document to database', lastContext, 'debug');
      } catch (error) {
        // Auth failures already carry a precise close code. Keep it so the client can react to 4401.
        if (isCloseEvent(error)) {
          throw error;
        }

        if (isResponseError(error)) {
          throw getCloseEvent('FAILED_TO_SAVE', 4000 + error.statusCode);
        }

        throw getCloseEvent('FAILED_TO_SAVE', 4500);
      }
    });
  },

  afterStoreDocument: async ({ lastContext }) => {
    if (!isConnectionContext(lastContext)) {
      return;
    }

    return withCollaborationSpan('afterStoreDocument', lastContext, async () => {
      logContext('After store document', lastContext, 'debug');
    });
  },

  afterUnloadDocument: async ({ documentName }) => {
    return withSpan('collaboration.afterUnloadDocument', { dokument_id: documentName }, async () => {
      log.debug({ msg: `Document unloaded: ${documentName}`, data: { dokumentId: documentName } });
    });
  },

  onCreateDocument: async ({ context }) => {
    if (!isConnectionContext(context)) {
      return;
    }

    return withCollaborationSpan('onCreateDocument', context, async () => {
      logContext('Create document', context, 'debug');
    });
  },

  extensions: isDeployed ? [getValkeyExtension()].filter(isNotNull) : [],
});

/**
 * Validates the Wonderwall access token from the upgrade request and stores it in the context.
 *
 * Only the access token is tracked: OBO tokens are minted just-in-time by oasis, which keeps its
 * own in-memory cache. The access token, on the other hand, cannot be renewed by us — a WebSocket
 * never receives new request headers — so its expiry is what the refresh loop has to work off.
 *
 * @returns Seconds until the access token expires.
 */
const setAccessToken = async (context: ConnectionContext, headers: Headers): Promise<number> => {
  const accessToken = stripBearer(headers.get('authorization') ?? undefined);

  if (accessToken === undefined) {
    logContext('Missing Authorization header: onConnect', context, 'warn');
    throw closeConnection(context, 'INVALID_SESSION', 4401);
  }

  const validation = await validateToken(accessToken);

  if (!validation.ok) {
    logContext(
      `Invalid access token: ${validation.error.message} (${validation.errorType}): onConnect`,
      context,
      'warn',
    );
    throw closeConnection(context, 'INVALID_SESSION', 4401);
  }

  const { exp } = validation.payload;

  if (exp === undefined) {
    logContext('Access token without expiry: onConnect', context, 'warn');
    throw closeConnection(context, 'INVALID_SESSION', 4401);
  }

  context.accessToken = accessToken;
  context.accessTokenExpiresAt = exp;

  return Math.floor(exp - Date.now() / 1_000);
};

const getAccessTokenExpiresIn = (context: ConnectionContext): number => {
  const { accessTokenExpiresAt } = context;

  // Set by setAccessToken() in onConnect, which gates every other hook, so this is a bug if it
  // happens. Return 0 rather than throwing, so callers treat the token as expired and close the
  // connection instead of trusting a token we know nothing about.
  if (accessTokenExpiresAt === undefined) {
    logContext('Missing access token expiry', context, 'error');

    return 0;
  }

  return Math.floor(accessTokenExpiresAt - Date.now() / 1_000);
};

const getHasWriteAccess = async (context: ConnectionContext, allowApiFetching?: boolean) => {
  const { dokumentId, navIdent, tab_id, client_version, behandlingId } = context;

  return SMART_DOCUMENT_WRITE_ACCESS.hasAccess(
    dokumentId,
    navIdent,
    {
      tab_id,
      client_version,
      behandling_id: behandlingId,
    },
    allowApiFetching,
  );
};
