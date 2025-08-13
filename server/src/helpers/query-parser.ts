export type Querystring = Record<string, string>;

/**
 * Parse a query string into an object.
 * Duplicate keys overwrite previous values.
 * @param query `foo=zap&foo=bar&baz=abc,123`
 * @returns `{ foo: 'bar', baz: 'abc,123' }`
 */
export const querystringParser = (query: string): Querystring => {
  const params = new URLSearchParams(query);

  return Object.fromEntries(params.entries());
};
