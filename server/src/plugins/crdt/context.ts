import { isObject } from '@app/functions/functions';

export interface ConnectionContext {
  readonly behandlingId: string;
  readonly dokumentId: string;
  readonly trace_id?: string;
  readonly span_id?: string;
  readonly tab_id?: string;
  readonly client_version?: string;
  readonly navIdent: string;
  readonly cookie: string | undefined;
  hasWriteAccess?: boolean;
  tokenRefreshTimer?: Timer;
  removeHasAccessListener?: () => void;
}

export const isConnectionContext = (data: unknown): data is ConnectionContext =>
  isObject(data) && 'behandlingId' in data && 'dokumentId' in data;
