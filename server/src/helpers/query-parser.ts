/**
 * Parse a query string into an object.
 * @param query `foo=bar&baz=abc,123`
 * @returns `{ foo: 'bar', baz: 'abc,123' }`
 */
export const querystringParser = (query: string): Record<string, string> =>
  query.split('&').reduce<Record<string, string>>((acc, q) => {
    const [key, value] = q.split('=');

    if (key !== undefined && value !== undefined) {
      acc[decode(key, 'key')] = decode(value, 'value');
    }

    return acc;
  }, {});

const decode = (value: string, name: string): string => {
  try {
    return decodeURIComponent(value);
  } catch (e) {
    console.warn(`Failed to decode query ${name}: "${value}"`, e);
    return value; // Return the original value if decoding fails
  }
};
