import type { FastifyRequest } from 'fastify';

export const TAB_ID_QUERY = 'tabId';
export const CLIENT_VERSION_QUERY = 'version';

export const getHeaderOrQueryValue = (
  req: FastifyRequest<{ Querystring: Record<string, string | undefined> }>,
  headerKey: string,
  queryKey: string,
): string | undefined => {
  const header = req.headers[headerKey];

  if (typeof header === 'string' && header.length > 0) {
    return header;
  }

  const query = req.query[queryKey];

  if (typeof query === 'string' && query.length > 0) {
    return query;
  }

  return undefined;
};
