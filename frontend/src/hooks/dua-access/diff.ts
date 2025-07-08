import { DUA_ACTION_VALUES } from '@app/hooks/dua-access/access';
import type { DuaAccessMap } from '@app/hooks/dua-access/access-map';

export const duaAccessAreEqual = (a: DuaAccessMap, b: DuaAccessMap): boolean => {
  for (const action of DUA_ACTION_VALUES) {
    if (a[action] !== b[action]) {
      return false;
    }
  }

  return true;
};
