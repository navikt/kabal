import { TElement, getNodeString, isElement } from '@udecode/plate-common';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3 } from '@udecode/plate-heading';
import { ELEMENT_OL, ELEMENT_UL } from '@udecode/plate-list';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { ELEMENT_TABLE } from '@udecode/plate-table';
import { isNotNull } from '@app/functions/is-not-type-guards';
import {
  ELEMENT_LABEL_CONTENT,
  ELEMENT_MALTEKST,
  ELEMENT_PLACEHOLDER,
  ELEMENT_REDIGERBAR_MALTEKST,
} from '@app/plate/plugins/element-types';
import { TemplateSections } from '@app/plate/template-sections';
import { createMaltekst, createRedigerbarMaltekst } from '@app/plate/templates/helpers';
import {
  MaltekstElement,
  MaltekstseksjonElement,
  ParentOrChildElement,
  PlaceholderElement,
  RedigerbarMaltekstElement,
  RootElement,
} from '@app/plate/types';
import { isOfElementType, isOfElementTypesFn } from '@app/plate/utils/queries';
import { RichTextTypes } from '@app/types/common-text-types';
import { PublishedRichTextVersion } from '@app/types/texts/responses';

export const getChildren = (
  texts: PublishedRichTextVersion[],
  previous: MaltekstseksjonElement,
  section: TemplateSections,
): (MaltekstElement | RedigerbarMaltekstElement)[] =>
  texts
    .flatMap(({ richText, textType, id }) => {
      const prevText = previous.children.find((c) => c.id === id);

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
        return createMaltekst(section, richText.filter(isParentOrChildElement), id);
      }

      if (textType === RichTextTypes.REDIGERBAR_MALTEKST) {
        return createRedigerbarMaltekst(section, richText.filter(isParentOrChildElement), id);
      }

      return null;
    })
    .filter(isNotNull);

const containsEditedPlaceholder = (node: TElement): boolean => {
  for (const child of node.children) {
    if (isOfElementType<PlaceholderElement>(child, ELEMENT_PLACEHOLDER)) {
      return getNodeString(child).length !== 0;
    }

    if (isElement(child)) {
      return containsEditedPlaceholder(child);
    }
  }

  return false;
};

const isParentOrChildElement = (node: RootElement): node is ParentOrChildElement =>
  isOfElementTypesFn([
    ELEMENT_PARAGRAPH,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_UL,
    ELEMENT_OL,
    ELEMENT_TABLE,
    ELEMENT_LABEL_CONTENT,
  ])(node);
