import { type Descendant, ElementApi, NodeApi, type Value } from 'platejs';
import { removeEmptyCharInText } from '@/functions/remove-empty-char-in-text';
import { ELEMENT_PLACEHOLDER } from '@/plate/plugins/element-types';
import type { PlaceholderElement } from '@/plate/types';
import { isOfElementType } from '@/plate/utils/queries';

const SPACE_REGEX = /\s+/g;

export const getTextAsString = (richText: Value): string =>
  richText.map(getElementString).join(' ').replaceAll(SPACE_REGEX, ' ');

const getElementString = (element: Descendant): string => {
  if (!ElementApi.isElement(element)) {
    return NodeApi.string(element);
  }

  return element.children
    .map<string>((c) => {
      if (isOfElementType<PlaceholderElement>(c, ELEMENT_PLACEHOLDER)) {
        const childrenTexts = removeEmptyCharInText(c.children.map(NodeApi.string).join('').trim());

        return childrenTexts.length === 0 ? c.placeholder : childrenTexts;
      }

      if (ElementApi.isElement(c)) {
        return c.children.map(getElementString).join(' ');
      }

      return removeEmptyCharInText(NodeApi.string(c));
    })
    .join('');
};
