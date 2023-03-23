import { GenericObject, Immutable, isGenericObject } from '../types/types';

export const deepFreeze = <T extends GenericObject>(toFreeze: T): Immutable<T> => {
  // Retrieve the property names defined on object.
  const propNames = Object.getOwnPropertyNames(toFreeze);

  // Freeze properties before freezing self.
  for (const name of propNames) {
    const value: unknown = toFreeze[name];

    if (isGenericObject(value)) {
      deepFreeze(value);
    }
  }

  return Object.freeze(toFreeze);
};
