import React from 'react';
import { Descendant, Text } from 'slate';
import { omit } from '../../../../functions/omit';
import { StyledLeaf } from '../../rich-text-editor/leaf/styled';
import { BlockQuoteStyle, ParagraphStyle, PlaceholderStyle } from '../../styled-elements/content';
import {
  HeadingFiveStyle,
  HeadingFourStyle,
  HeadingOneStyle,
  HeadingSixStyle,
  HeadingThreeStyle,
  HeadingTwoStyle,
} from '../../styled-elements/headings';
import { IndentStyle } from '../../styled-elements/indent';
import { BulletListStyle, ListItemStyle, NumberedListStyle } from '../../styled-elements/lists';
import { ContentTypeEnum, HeadingTypesEnum, ListContentEnum, ListTypesEnum } from '../../types/editor-enums';
import { isVoid } from '../../types/editor-type-guards';
import { CustomTextType, NonVoidElementTypes } from '../../types/editor-types';

export const renderElement = (element: Descendant, key: string) => {
  if (Text.isText(element)) {
    return renderLeaf(element, key);
  }

  if (isVoid(element)) {
    return null;
  }

  const renderedChildren = element.children.map((child, i) =>
    Text.isText(child) ? renderLeaf(child, `${key}-${i}`) : renderElement(child, `${key}-${i}`)
  );

  switch (element.type) {
    case ContentTypeEnum.PARAGRAPH: {
      return (
        <ParagraphStyle {...getAttributes(element)} key={key}>
          {renderedChildren}
        </ParagraphStyle>
      );
    }
    case HeadingTypesEnum.HEADING_ONE: {
      return (
        <HeadingOneStyle {...getAttributes(element)} key={key}>
          {renderedChildren}
        </HeadingOneStyle>
      );
    }
    case HeadingTypesEnum.HEADING_TWO: {
      return (
        <HeadingTwoStyle {...getAttributes(element)} key={key}>
          {renderedChildren}
        </HeadingTwoStyle>
      );
    }
    case HeadingTypesEnum.HEADING_THREE: {
      return (
        <HeadingThreeStyle {...getAttributes(element)} key={key}>
          {renderedChildren}
        </HeadingThreeStyle>
      );
    }
    case HeadingTypesEnum.HEADING_FOUR: {
      return (
        <HeadingFourStyle {...getAttributes(element)} key={key}>
          {renderedChildren}
        </HeadingFourStyle>
      );
    }
    case HeadingTypesEnum.HEADING_FIVE: {
      return (
        <HeadingFiveStyle {...getAttributes(element)} key={key}>
          {renderedChildren}
        </HeadingFiveStyle>
      );
    }
    case HeadingTypesEnum.HEADING_SIX: {
      return (
        <HeadingSixStyle {...getAttributes(element)} key={key}>
          {renderedChildren}
        </HeadingSixStyle>
      );
    }
    case ListTypesEnum.BULLET_LIST: {
      return (
        <BulletListStyle {...getAttributes(element)} key={key}>
          {renderedChildren}
        </BulletListStyle>
      );
    }
    case ListTypesEnum.NUMBERED_LIST: {
      return (
        <NumberedListStyle {...getAttributes(element)} key={key}>
          {renderedChildren}
        </NumberedListStyle>
      );
    }
    case ListContentEnum.LIST_ITEM: {
      return (
        <ListItemStyle {...getAttributes(element)} key={key}>
          {renderedChildren}
        </ListItemStyle>
      );
    }
    case ListContentEnum.LIST_ITEM_CONTAINER: {
      return (
        <div {...getAttributes(element)} key={key}>
          {renderedChildren}
        </div>
      );
    }
    case ContentTypeEnum.INDENT: {
      return (
        <IndentStyle {...getAttributes(element)} key={key}>
          {renderedChildren}
        </IndentStyle>
      );
    }
    case ContentTypeEnum.BLOCKQUOTE: {
      return (
        <BlockQuoteStyle {...getAttributes(element)} key={key}>
          {renderedChildren}
        </BlockQuoteStyle>
      );
    }
    case ContentTypeEnum.PLACEHOLDER: {
      return <PlaceholderStyle key={key}>{element.placeholder}</PlaceholderStyle>;
    }
    default: {
      return null;
    }
  }
};

const getAttributes = <T extends NonVoidElementTypes>(element: T) => omit(element, 'children', 'type');

const renderLeaf = ({ text, ...attributes }: CustomTextType, key: string) => (
  <StyledLeaf {...attributes} commentIds={[]} key={key} hasText={text.length !== 0} isExpanded={false}>
    {text}
  </StyledLeaf>
);
