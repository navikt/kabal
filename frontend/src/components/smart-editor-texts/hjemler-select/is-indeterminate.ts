import { GLOBAL, LIST_DELIMITER } from '@app/components/smart-editor-texts/types';

export const isIndeterminate = (selectedList: string[], hjemmelId: string, ytelseId: string): boolean => {
  let isGlobal = false;

  for (const selected of selectedList) {
    const [y, h] = selected.split(LIST_DELIMITER);

    if (h === hjemmelId) {
      if (y === ytelseId) {
        return false;
      }

      if (y === GLOBAL) {
        isGlobal = true;
      }
    }
  }

  return isGlobal;
};
