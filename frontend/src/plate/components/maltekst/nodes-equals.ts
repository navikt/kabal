import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { NodeApi, TextApi, type TNode } from 'platejs';

export const nodesEquals = (a: TNode[], b: TNode[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  const equals = a.every((n, i) => {
    const n2 = b[i];

    if (n2 === undefined) {
      return false;
    }

    if (TextApi.isText(n)) {
      if (!TextApi.isText(n2)) {
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

    if (NodeApi.isNodeList(n2.children) && NodeApi.isNodeList(n.children)) {
      return nodesEquals(n.children, n2.children);
    }

    return false;
  });

  return equals;
};
