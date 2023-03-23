import { stringify } from 'qs';
import { SimpleApiState } from './simple-api-state';

interface PathParams<Q> {
  query?: Q;
  path?: string;
}

export const getStateFactory = <T, Q>(basePath: string) => {
  const STATES: Map<string, SimpleApiState<T>> = new Map();

  return ({ path = '', query }: PathParams<Q>) => {
    const q = stringify(query, { arrayFormat: 'comma', skipNulls: true, addQueryPrefix: true });
    const url = `/api${basePath}${path}${q}`;
    const existing = STATES.get(url);

    if (existing === undefined) {
      const state = new SimpleApiState<T>(url);
      STATES.set(url, state);

      return state;
    }

    return existing;
  };
};
