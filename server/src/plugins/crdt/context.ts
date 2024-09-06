import { isObject } from '@app/plugins/crdt/functions';
import { FastifyRequest } from 'fastify';

export interface ConnectionContext {
  readonly behandlingId: string;
  readonly dokumentId: string;
  readonly req: FastifyRequest;
  readonly readOnly: boolean;
}

export const isConnectionContext = (data: unknown): data is ConnectionContext =>
  isObject(data) && 'behandlingId' in data && 'dokumentId' in data && 'req' in data && 'readOnly' in data;
