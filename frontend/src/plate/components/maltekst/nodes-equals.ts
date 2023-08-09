import { TNode, isNodeList, isText } from '@udecode/plate-common';
import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';

export const nodesEquals = <T extends TNode>(a: T[], b: T[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  const equals = a.every((n, i) => {
    const n2 = b[i];

    if (n2 === undefined) {
      return false;
    }

    if (isText(n)) {
      if (!isText(n2)) {
        return false;
      }

      return n.text === n2.text;
    }

    if (n.type !== n2.type) {
      return false;
    }

    if (n.type === ELEMENT_PLACEHOLDER) {
      return true;
    }

    if (isNodeList(n2.children) && isNodeList(n.children)) {
      return nodesEquals(n.children, n2.children);
    }

    return false;
  });

  return equals;
};
