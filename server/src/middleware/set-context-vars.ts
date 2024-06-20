import { Context, MiddlewareHandler } from 'hono';
import { AUTHORIZATION_HEADER, CLIENT_VERSION_HEADER, TAB_ID_HEADER } from '@app/headers';

const TAB_ID_QUERY = 'tabId';
const CLIENT_VERSION_QUERY = 'version';

export const setContextVars: MiddlewareHandler = async (context, next) => {
  const authHeader = context.req.header(AUTHORIZATION_HEADER);

  if (authHeader !== undefined) {
    const [, accessToken] = authHeader.split(' ');

    if (accessToken !== undefined) {
      context.set('accessToken', accessToken);
    }
  }

  context.set('tabId', getHeaderOrQueryValue(context, TAB_ID_HEADER, TAB_ID_QUERY));
  context.set('clientVersion', getHeaderOrQueryValue(context, CLIENT_VERSION_HEADER, CLIENT_VERSION_QUERY));

  return await next();
};

const getHeaderOrQueryValue = (context: Context, headerKey: string, queryKey: string): string | undefined => {
  const header = context.req.header(headerKey);

  if (typeof header === 'string' && header.length !== 0) {
    return header;
  }

  const query = context.req.query(queryKey);

  if (typeof query === 'string' && query.length !== 0) {
    return query;
  }

  return undefined;
};
