import type { IncomingHttpHeaders } from 'node:http';
import { Hocuspocus } from '@hocuspocus/server';
import { applyUpdateV2 } from 'yjs';
import { ApiClientEnum } from '@/config/config';
import { isDeployed } from '@/config/env';
import { SMART_DOCUMENT_WRITE_ACCESS } from '@/document-access/service';
import { isNotNull } from '@/functions/guards';
import { parseTokenPayload } from '@/helpers/token-parser';
import { withSpan } from '@/helpers/tracing';
import { getTeamLogger } from '@/logger';
import { getDocument } from '@/plugins/crdt/api/get-document';
import { getDocumentJson, isResponseError, setDocument } from '@/plugins/crdt/api/set-document';
import { getCloseEvent } from '@/plugins/crdt/close-event';
import { type ConnectionContext, isConnectionContext } from '@/plugins/crdt/context';
import { DEBOUNCE_MS, endActivity, trackActivity, withCollaborationSpan } from '@/plugins/crdt/crdt-tracing';
import { log, logContext } from '@/plugins/crdt/log-context';
import { createRefreshTimer } from '@/plugins/crdt/refresh';
import { sendStateless } from '@/plugins/crdt/send-stateless';
import { getValkeyExtension } from '@/plugins/crdt/valkey';
import { getOboToken } from '@/plugins/obo-token';

const teamLog = getTeamLogger('collaboration');

export const collaborationServer = new Hocuspocus({
  name: 'kabal-collaboration-server',
  timeout: 5_000,
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
      const expiresIn = await getTokenExpiresIn(context, requestHeaders, 'onConnect');

      span.setAttribute('collaboration.token_expires_in', expiresIn);

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
        connection.close(getCloseEvent('DOCUMENT_DELETED', 4410));
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
        logContext('Refresh OBO token timer cleared', context, 'debug');
      }

      context.removeHasAccessListener?.();
      context.removeDeletedListener?.();
    });
  },

  beforeHandleMessage: async ({ context, connection, requestHeaders }) => {
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
      const expiresIn = await getTokenExpiresIn(context, requestHeaders, 'beforeHandleMessage');
      logContext('Missing refresh OBO token timer. Starting timer.', context, 'warn');
      await createRefreshTimer(context, expiresIn);
    }

    const expiresIn = await getTokenExpiresIn(context, requestHeaders, 'beforeHandleMessage');

    if (expiresIn <= 0) {
      return withCollaborationSpan('beforeHandleMessage', context, async (span) => {
        span.setAttribute('token_expires_in', expiresIn);
        logContext(`OBO token expired ${expiresIn} seconds ago.`, context, 'warn');
        throw getCloseEvent('OBO_TOKEN_EXPIRED', 4401);
      });
    }

    const hasWriteAccess = await getHasWriteAccess(context);
    connection.readOnly = !hasWriteAccess;
  },

  onChange: async ({ context, requestHeaders }) => {
    if (!isConnectionContext(context)) {
      return;
    }

    const expiresIn = await getTokenExpiresIn(context, requestHeaders, 'onChange');
    const hasWriteAccess = await getHasWriteAccess(context);

    trackActivity(context, expiresIn, hasWriteAccess);
  },

  beforeUnloadDocument: async ({ documentName }) => {
    return withSpan('collaboration.beforeUnloadDocument', { dokument_id: documentName }, async () => {
      log.debug({ msg: `Before unload document: ${documentName}`, data: { dokumentId: documentName } });
    });
  },

  onLoadDocument: async ({ context, document, connectionConfig, requestHeaders }) => {
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

      const res = await getDocument(context, requestHeaders);

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

  onStoreDocument: async ({ context, document, requestHeaders }) => {
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

    return withCollaborationSpan('onStoreDocument', context, async () => {
      try {
        await setDocument(context, document, requestHeaders);

        logContext('Saved document to database', context, 'debug');
      } catch (error) {
        if (isResponseError(error)) {
          throw getCloseEvent('FAILED_TO_SAVE', 4000 + error.statusCode);
        }

        throw getCloseEvent('FAILED_TO_SAVE', 4500);
      }
    });
  },

  afterStoreDocument: async ({ context }) => {
    if (!isConnectionContext(context)) {
      return;
    }

    return withCollaborationSpan('afterStoreDocument', context, async () => {
      logContext('After store document', context, 'debug');
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

const getTokenExpiresIn = async (context: ConnectionContext, headers: IncomingHttpHeaders, method: string) => {
  const { authorization } = headers;

  if (authorization === undefined) {
    logContext(`Missing Authorization header: ${method}`, context, 'warn');

    return 0;
  }

  const oboAccessToken = await getOboToken(ApiClientEnum.KABAL_API, { ...context, accessToken: authorization });

  if (oboAccessToken === undefined) {
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
