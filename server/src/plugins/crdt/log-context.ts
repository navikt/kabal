import { type AnyObject, getLogger, type Level } from '@app/logger';
import type { ConnectionContext } from '@app/plugins/crdt/context';

export const log = getLogger('collaboration');

export const logContext = (msg: string, context: ConnectionContext, level: Level = 'info', extra?: AnyObject) => {
  log[level]({
    msg,
    trace_id: context.trace_id,
    span_id: context.span_id,
    tab_id: context.tab_id,
    client_version: context.client_version,
    data: {
      behandling_id: context.behandlingId,
      dokument_id: context.dokumentId,
      nav_ident: context.navIdent,
      read_only: context.hasWriteAccess === undefined ? true : !context.hasWriteAccess,
      ...extra,
    },
  });
};
