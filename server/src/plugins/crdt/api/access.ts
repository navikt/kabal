import { getHeaders } from '@app/plugins/crdt/api/headers';
import { KABAL_API_URL } from '@app/plugins/crdt/api/url';
import { FastifyRequest } from 'fastify';

export enum DocumentAccess {
  NONE = 'NONE',
  READ = 'READ',
  WRITE = 'WRITE',
}

export const getDocumentAccess = async (
  behandlingId: string,
  dokumentId: string,
  req: FastifyRequest,
): Promise<DocumentAccess | null> => {
  const res = await fetch(`${KABAL_API_URL}/behandlinger/${behandlingId}/smartdokumenter/${dokumentId}/access`, {
    method: 'GET',
    headers: getHeaders(req),
  });

  if (!res.ok) {
    return null;
  }

  const json = await res.json();

  if (!isAccessResponse(json)) {
    return null;
  }

  return json.access;
};

const isAccessResponse = (json: unknown): json is AccessResponse =>
  typeof json === 'object' && json !== null && 'access' in json;

interface AccessResponse {
  access: DocumentAccess;
}
