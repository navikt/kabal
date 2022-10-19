import { Editor, Element, Node, Text } from 'slate';
import { AlignableTypeEnum, ContentTypeEnum, ElementTypesEnum, HeadingTypesEnum } from './editor-enums';
import { AlignableElementTypes, MarkKeyList, VOID_ELEMENT_TYPES } from './editor-types';
import { VoidElementTypes } from './editor-void-types';
import { MarkKeys } from './marks';

export const isVoid = (element: Element): element is VoidElementTypes =>
  VOID_ELEMENT_TYPES.some((t) => t === element.type);

export const isMarkKey = (s: string): s is MarkKeys => MarkKeyList.includes(s);

export const isNodeAlignableElementType = (n: Node): n is AlignableElementTypes => {
  if (!Element.isElement(n)) {
    return false;
  }

  return isTypeAlignable(n.type);
};

const NON_MARKABLE_TYPES = Object.values(HeadingTypesEnum);

export const isNodeMarkableElementType = (n: Node) => {
  if (Text.isText(n) || Editor.isEditor(n)) {
    return true;
  }

  return NON_MARKABLE_TYPES.every((t) => t !== n.type);
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
