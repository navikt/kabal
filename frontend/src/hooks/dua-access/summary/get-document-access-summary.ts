import { DUA_ACTION_VALUES } from '@app/hooks/dua-access/access';
import type { DuaAccessMap } from '@app/hooks/dua-access/access-map';

export const getDocumentAccessSummary = (access: DuaAccessMap) => {
  const lines: string[] = [];

  for (const action of DUA_ACTION_VALUES) {
    const error = access[action];

    if (error === null) {
      continue;
    }

    lines.push(error);
  }

  return `- ${lines.join('\n- ')}`;
};
