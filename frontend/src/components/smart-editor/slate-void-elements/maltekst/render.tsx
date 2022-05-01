import React from 'react';
import { Text } from 'slate';
import styled from 'styled-components';
import {
  ContentTypeEnum,
  CustomTextType,
  HeadingTypesEnum,
  ListContentEnum,
  ListTypesEnum,
  NonVoidElementTypes,
} from '../../editor-types';
import { StyledLeaf } from '../../rich-text-editor/leaf/styled';
import { BlockQuoteStyle, ParagraphStyle } from '../../styled-elements/content';
import {
  HeadingFiveStyle,
  HeadingFourStyle,
  HeadingOneStyle,
  HeadingSixStyle,
  HeadingThreeStyle,
  HeadingTwoStyle,
} from '../../styled-elements/headings';
import { BulletListStyle, ListItemStyle, NumberedListStyle } from '../../styled-elements/lists';

export const renderElement = (element: NonVoidElementTypes, key: string) => {
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
        <StyledListItemContainer {...getAttributes(element)} key={key}>
          {renderedChildren}
        </StyledListItemContainer>
      );
    }

    case ContentTypeEnum.BLOCKQUOTE: {
      return (
        <BlockQuoteStyle {...getAttributes(element)} key={key}>
          {renderedChildren}
        </BlockQuoteStyle>
      );
    }
  }
};

const getAttributes = <T extends NonVoidElementTypes>(element: T): Omit<T, 'children' | 'type'> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, children, ...attributes } = element;
  return attributes;
};

const StyledListItemContainer = styled.div``;

export const renderLeaf = ({ text, ...attributes }: CustomTextType, key: string) => (
  <StyledLeaf {...attributes} commentIds={[]} key={key}>
    {text}
  </StyledLeaf>
);
