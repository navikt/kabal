import { TDescendant, isElement } from '@udecode/plate-common';
import { removeEmptyCharInText } from '@app/functions/remove-empty-char-in-text';

export const areDescendantsEqual = (listA: TDescendant[], listB: TDescendant[]): boolean => {
  if (listA.length !== listB.length) {
    return false;
  }

  for (let i = listA.length - 1; i >= 0; i--) {
    const nodeA = listA[i];
    const nodeB = listB[i];

    if (nodeA === undefined || nodeB === undefined) {
      return false;
    }

    if (isElement(nodeA)) {
      if (!isElement(nodeB)) {
        return false;
      }

      const { type: aType, children: aChildren, ...aRest } = nodeA;
      const { type: bType, children: bChildren, ...bRest } = nodeB;

      if (aType !== bType) {
        return false;
      }

      if (!areKeysEqual(aRest, bRest)) {
        return false;
      }

      return areDescendantsEqual(aChildren, bChildren);
    }

    if (isElement(nodeB)) {
      return false;
    }

    const { text: aText, ...aRest } = nodeA;
    const { text: bText, ...bRest } = nodeB;
    const aCleanText = removeEmptyCharInText(aText);
    const bCleanText = removeEmptyCharInText(bText);

    if (aCleanText !== bCleanText) {
      return false;
    }

    if (!areKeysEqual(aRest, bRest)) {
      return false;
    }
  }

  return true;
};

const areKeysEqual = (a: Record<string, unknown>, b: Record<string, unknown>): boolean => {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (const key of aKeys) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  for (const key of bKeys) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
};
