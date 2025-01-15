import { areDescendantsEqual } from '@app/functions/are-descendants-equal';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { removeEmptyCharInText } from '@app/functions/remove-empty-char-in-text';
import {
  ELEMENT_LABEL_CONTENT,
  ELEMENT_MALTEKST,
  ELEMENT_PLACEHOLDER,
  ELEMENT_REDIGERBAR_MALTEKST,
} from '@app/plate/plugins/element-types';
import type { TemplateSections } from '@app/plate/template-sections';
import { createMaltekst, createRedigerbarMaltekst } from '@app/plate/templates/helpers';
import type {
  MaltekstElement,
  MaltekstseksjonElement,
  ParentOrChildElement,
  PlaceholderElement,
  RedigerbarMaltekstElement,
} from '@app/plate/types';
import { isOfElementType, isOfElementTypesFn } from '@app/plate/utils/queries';
import { RichTextTypes } from '@app/types/common-text-types';
import type { IConsumerRichText } from '@app/types/texts/consumer';
import type { Language } from '@app/types/texts/language';
import { BaseParagraphPlugin, ElementApi, NodeApi, type TElement } from '@udecode/plate';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { BaseBulletedListPlugin, BaseNumberedListPlugin } from '@udecode/plate-list';
import { BaseTablePlugin } from '@udecode/plate-table';

export const getNewChildren = (
  texts: IConsumerRichText[],
  previous: MaltekstseksjonElement,
  section: TemplateSections,
  language: Language,
): (MaltekstElement | RedigerbarMaltekstElement)[] =>
  texts
    .flatMap(({ richText, textType, id }) => {
      const prevText = previous.children.find((c) => c.id === id && c.language === language);

      if (prevText !== undefined) {
        if (isOfElementType<RedigerbarMaltekstElement>(prevText, ELEMENT_REDIGERBAR_MALTEKST)) {
          return prevText;
        }

        if (
          isOfElementType<MaltekstElement>(prevText, ELEMENT_MALTEKST) &&
          prevText.children.some(containsEditedPlaceholder)
        ) {
          return prevText;
        }
      }

      if (textType === RichTextTypes.MALTEKST) {
        return createMaltekst(section, richText.filter(isParentOrChildElement), id, language);
      }

      if (textType === RichTextTypes.REDIGERBAR_MALTEKST) {
        return createRedigerbarMaltekst(section, richText.filter(isParentOrChildElement), id, language);
      }

      return null;
    })
    .filter(isNotNull);

const containsEditedPlaceholder = (node: TElement): boolean => {
  for (const child of node.children) {
    if (isOfElementType<PlaceholderElement>(child, ELEMENT_PLACEHOLDER)) {
      return NodeApi.string(child).length > 0;
    }

    if (ElementApi.isElement(child)) {
      return containsEditedPlaceholder(child);
    }
  }

  return false;
};

export const areFromPlaceholdersSafeToReplaceWithToPlaceholders = (
  fromElement: TElement,
  toElement: TElement,
): boolean => {
  const fromPlaceholderList = getPlaceholders(fromElement);
  const toPlaceholderList = getPlaceholders(toElement);

  const max = fromPlaceholderList.length;

  for (let i = 0; i < max; i++) {
    const from = fromPlaceholderList[i];
    const to = toPlaceholderList[i];

    if (from === undefined) {
      return true;
    }

    if (to === undefined) {
      if (from.children.some(({ text }) => removeEmptyCharInText(text).length > 0)) {
        return false;
      }
      continue;
    }

    if (!areDescendantsEqual(from.children, to.children)) {
      return false;
    }
  }

  return true;
};

const getPlaceholders = (element: TElement): PlaceholderElement[] => {
  const list: PlaceholderElement[] = [];

  const generator = NodeApi.elements(element);

  for (const [n] of generator) {
    if (isOfElementType<PlaceholderElement>(n, ELEMENT_PLACEHOLDER)) {
      list.push(n);
    }
  }

  return list;
};

const isParentOrChildElement = (node: TElement): node is ParentOrChildElement =>
  isOfElementTypesFn([
    BaseParagraphPlugin.key,
    HEADING_KEYS.h1,
    HEADING_KEYS.h2,
    HEADING_KEYS.h3,
    BaseBulletedListPlugin.key,
    BaseNumberedListPlugin.key,
    BaseTablePlugin.key,
    ELEMENT_LABEL_CONTENT,
  ])(node);
