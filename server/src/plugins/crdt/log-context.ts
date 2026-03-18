import { type AnyObject, getLogger, type Level } from '@/logger';
import { type ConnectionContext, getTraceId } from '@/plugins/crdt/context';

export const log = getLogger('collaboration');

export const logContext = (msg: string, context: ConnectionContext, level: Level = 'info', extra?: AnyObject) => {
  const traceId = getTraceId(context);

  log[level]({
    msg,
    tab_id: context.tab_id,
    client_version: context.client_version,
    trace_id: traceId,
    data: {
      behandling_id: context.behandlingId,
      dokument_id: context.dokumentId,
      nav_ident: context.navIdent,
      read_only: context.hasWriteAccess === undefined ? true : !context.hasWriteAccess,
      ...extra,
    },
  });
};
