import { removeEmptyCharInText } from '@app/functions/remove-empty-char-in-text';
import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import type { PlaceholderElement } from '@app/plate/types';
import { isOfElementType } from '@app/plate/utils/queries';
import { type TDescendant, type Value, getNodeString, isElement } from '@udecode/plate-common';

const SPACE_REGEX = /\s+/g;

export const getTextAsString = (richText: Value): string =>
  richText.map(getElementString).join(' ').replaceAll(SPACE_REGEX, ' ');

const getElementString = (element: TDescendant): string => {
  if (!isElement(element)) {
    return getNodeString(element);
  }

  return element.children
    .map<string>((c) => {
      if (isOfElementType<PlaceholderElement>(c, ELEMENT_PLACEHOLDER)) {
        const childrenTexts = removeEmptyCharInText(c.children.map(getNodeString).join('').trim());

        return childrenTexts.length === 0 ? c.placeholder : childrenTexts;
      }

      if (isElement(c)) {
        return c.children.map(getElementString).join(' ');
      }

      return removeEmptyCharInText(getNodeString(c));
    })
    .join('');
};
