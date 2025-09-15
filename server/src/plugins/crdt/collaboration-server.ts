import { getCacheKey, oboCache } from '@app/auth/cache/cache';
import { ApiClientEnum } from '@app/config/config';
import { isDeployed } from '@app/config/env';
import { SMART_DOCUMENT_WRITE_ACCESS } from '@app/document-access/service';
import { isNotNull } from '@app/functions/guards';
import { parseTokenPayload } from '@app/helpers/token-parser';
import { getTeamLogger } from '@app/logger';
import { getDocument } from '@app/plugins/crdt/api/get-document';
import { getDocumentJson, setDocument } from '@app/plugins/crdt/api/set-document';
import { getCloseEvent } from '@app/plugins/crdt/close-event';
import { type ConnectionContext, isConnectionContext } from '@app/plugins/crdt/context';
import { log, logContext } from '@app/plugins/crdt/log-context';
import { createRefreshTimer } from '@app/plugins/crdt/refresh';
import { getValkeyExtension } from '@app/plugins/crdt/valkey';
import { Hocuspocus } from '@hocuspocus/server';
import { applyUpdateV2 } from 'yjs';

const teamLog = getTeamLogger('collaboration');

export const collaborationServer = new Hocuspocus({
  name: 'kabal-collaboration-server',
  timeout: 5_000,
  debounce: 3_000,
  maxDebounce: 15_000,

  onAuthenticate: async ({ context, connectionConfig }) => {
    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to authenticate collaboration connection without context' });
      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }

    const { dokumentId, navIdent, behandlingId } = context;

    const hasWriteAccess = await getHasWriteAccess(context, true);

    context.hasWriteAccess = hasWriteAccess;

    connectionConfig.readOnly = !hasWriteAccess;

    logContext(
      `Authenticated collaboration socket for ${dokumentId} in ${behandlingId} for user ${navIdent} ${hasWriteAccess ? 'User has write access' : 'User does not have write access'}.`,
      context,
      'debug',
    );
  },

  onConnect: async ({ context, connectionConfig }) => {
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

    await createRefreshTimer(context, expiresIn);

    const { dokumentId, navIdent, behandlingId } = context;

    const hasWriteAccess = await getHasWriteAccess(context, true);

    connectionConfig.readOnly = !hasWriteAccess;

    logContext(
      `Connected collaboration socket for ${dokumentId} in ${behandlingId} for user ${navIdent}. ${hasWriteAccess ? 'User has write access' : 'User does not have write access'}.`,
      context,
      'debug',
    );
  },

  connected: async ({ context, connection, documentName }) => {
    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to establish collaboration connection without context' });
      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }

    logContext('New collaboration connection established', context, 'debug');

    const { navIdent, trace_id, span_id, tab_id, client_version } = context;

    context.removeHasAccessListener = SMART_DOCUMENT_WRITE_ACCESS.addHasAccessListener(
      documentName,
      navIdent,
      { trace_id, span_id, tab_id, client_version },
      (hasWriteAccess) => {
        connection.sendStateless(hasWriteAccess ? 'read-write' : 'readonly');
      },
    );
  },

  onDisconnect: async ({ context }) => {
    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to close collaboration connection without context' });
      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }

    // navIdent is not defined locally.
    logContext(`Collaboration connection closed for ${context.navIdent}.`, context, 'debug');

    if (context.tokenRefreshTimer !== undefined) {
      clearTimeout(context.tokenRefreshTimer);
      context.tokenRefreshTimer = undefined;
      logContext('Refresh OBO token timer cleared', context, 'debug');
    }

    context.removeHasAccessListener?.();
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
      throw getCloseEvent('MISSING_COOKIE', 4401);
    }

    if (context.tokenRefreshTimer === undefined) {
      const expiresIn = await getTokenExpiresIn(context, 'beforeHandleMessage');
      logContext('Missing refresh OBO token timer. Starting timer.', context, 'warn');
      await createRefreshTimer(context, expiresIn);
    }

    const expiresIn = await getTokenExpiresIn(context, 'beforeHandleMessage');

    if (expiresIn <= 0) {
      logContext(`OBO token expired ${expiresIn} seconds ago.`, context, 'warn');
      throw getCloseEvent('OBO_TOKEN_EXPIRED', 4401);
    }

    const hasWriteAccess = await getHasWriteAccess(context);

    connection.readOnly = !hasWriteAccess;
  },

  onLoadDocument: async ({ context, document, connectionConfig }) => {
    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to load document without context' });
      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }

    const { dokumentId, navIdent } = context;

    const hasWriteAccess = await getHasWriteAccess(context, true);

    if (!document.isEmpty('content')) {
      logContext(
        `Document ${dokumentId} already loaded for user ${navIdent}. User ${hasWriteAccess ? 'has' : 'does not have'} write access.`,
        context,
        'debug',
      );

      connectionConfig.readOnly = !hasWriteAccess;

      return document;
    }

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
  },

  onStoreDocument: async ({ context, document }) => {
    if (!isConnectionContext(context)) {
      log.error({ msg: 'Tried to store document without context' });

      teamLog.debug({
        msg: 'Tried to store document without context',
        data: {
          document: JSON.stringify(getDocumentJson(document)),
          context: JSON.stringify({ ...context, abortController: undefined }),
        },
      });

      throw getCloseEvent('INVALID_CONTEXT', 4401);
    }

    await setDocument(context, document);

    logContext('Saved document to database', context, 'debug');
  },

  extensions: isDeployed ? [getValkeyExtension()].filter(isNotNull) : [],
});

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

const getHasWriteAccess = async (context: ConnectionContext, allowApiFetching?: boolean) => {
  const { dokumentId, navIdent, trace_id, span_id, tab_id, client_version, behandlingId } = context;

  return SMART_DOCUMENT_WRITE_ACCESS.hasAccess(
    dokumentId,
    navIdent,
    {
      trace_id,
      span_id,
      tab_id,
      client_version,
      behandling_id: behandlingId,
    },
    allowApiFetching,
  );
};
