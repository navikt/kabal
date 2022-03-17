import { Immutable } from '../types/types';

export const deepFreeze = <T>(toFreeze: T): Immutable<T> => {
  // Retrieve the property names defined on object.
  const propNames = Object.getOwnPropertyNames(toFreeze);

  // Freeze properties before freezing self.
  for (const name of propNames) {
    const value: unknown = toFreeze[name];

    if (value !== null && typeof value === 'object') {
      deepFreeze(value);
    }
  }

  return Object.freeze(toFreeze);
};
