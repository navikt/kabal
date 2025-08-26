export type Querystring = Record<string, string>;

/**
 * Parse a query string into an object.
 * Duplicate keys overwrite previous values.
 * @param query `foo=zap&foo=bar&baz=abc,123&active=true&present`
 * @returns `{ foo: 'bar', baz: 'abc,123', active: 'true', present: '' }`
 */
export const querystringParser = (query: string): Querystring => {
  const params = new URLSearchParams(query);

  return Object.fromEntries(params.entries());
};
