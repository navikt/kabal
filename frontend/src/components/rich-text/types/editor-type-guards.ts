import { Element, Node } from 'slate';
import { AlignableTypeEnum, ContentTypeEnum, ElementTypesEnum, MarkableTypeEnum } from './editor-enums';
import { AlignableElementTypes, MarkKeyList, MarkableElementTypes, VOID_ELEMENT_TYPES } from './editor-types';
import { CommentableVoidElementTypes, VoidElementTypes } from './editor-void-types';
import { MarkKeys } from './marks';

export const isVoid = (element: Element): element is VoidElementTypes =>
  VOID_ELEMENT_TYPES.some((t) => t === element.type);

export const isCommentableVoid = (element: Element): element is CommentableVoidElementTypes =>
  typeof element === 'object' &&
  element !== null &&
  'threadIds' in element &&
  Object.hasOwn(element, 'threadIds') &&
  Array.isArray(element.threadIds);

export const isMarkKey = (s: string): s is MarkKeys => MarkKeyList.includes(s);

export const isNodeAlignableElementType = (n: Node): n is AlignableElementTypes => {
  if (!Element.isElement(n)) {
    return false;
  }

  return isTypeAlignable(n.type);
};

const MARKABLE_TYPES = Object.values(MarkableTypeEnum);

export const isNodeMarkableElementType = (n: Node): n is MarkableElementTypes => {
  if (!Element.isElement(n)) {
    return false;
  }

  for (const type of MARKABLE_TYPES) {
    if (n.type === type) {
      return true;
    }
  }

  return false;
};

export const isOfElementTypeFn =
  <T extends Element>(type: ElementTypesEnum) =>
  (n: Node): n is T =>
    Element.isElement(n) && n.type === type;

export const isOfElementType = <T extends Element>(n: Node, type: ElementTypesEnum): n is T =>
  Element.isElement(n) && n.type === type;

export const isOfElementTypesFn =
  <T extends Element>(types: ElementTypesEnum[]) =>
  (n: Node): n is T =>
    Element.isElement(n) && types.includes(n.type);

export const isOfElementTypes = <T extends Element>(n: Node, types: ElementTypesEnum[]): n is T =>
  Element.isElement(n) && types.includes(n.type);

export const isNodeOfSameElementType = <T extends Element>(n: Node, element: T): n is T =>
  Element.isElement(n) && n.type === element.type;

const isTypeAlignable = (type: ElementTypesEnum): type is ContentTypeEnum => {
  for (const alignableType of Object.values(AlignableTypeEnum)) {
    if (type === alignableType) {
      return true;
    }
  }

  return false;
};
