import { isObject } from '@app/plugins/crdt/functions';

export interface ConnectionContext {
  readonly behandlingId: string;
  readonly dokumentId: string;
  readonly trace_id?: string;
  readonly span_id?: string;
  readonly tab_id?: string;
  readonly client_version?: string;
  readonly navIdent: string;
}

export const isConnectionContext = (data: unknown): data is ConnectionContext =>
  isObject(data) && 'behandlingId' in data && 'dokumentId' in data;
