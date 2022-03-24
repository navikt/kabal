import React from 'react';
import { RenderElementProps as RenderElementPropsBase } from 'slate-react';
import {
  AlignableElementTypes,
  ContentTypeEnum,
  HeadingTypesEnum,
  ListContentEnum,
  ListTypesEnum,
} from './editor-types';
import { BlockQuoteStyle, ParagraphStyle } from './styled-elements/content';
import {
  HeadingFiveStyle,
  HeadingFourStyle,
  HeadingOneStyle,
  HeadingSixStyle,
  HeadingThreeStyle,
  HeadingTwoStyle,
} from './styled-elements/headings';
import { BulletListStyle, ListItemStyle, NumberedListStyle } from './styled-elements/lists';

export interface RenderElementProps extends RenderElementPropsBase {
  key?: string | number;
}

interface AlignableProps extends RenderElementProps {
  element: AlignableElementTypes;
}

export const HeadingOneElement = (props: RenderElementProps) => (
  <HeadingOneStyle {...props.attributes}>{props.children}</HeadingOneStyle>
);

export const HeadingTwoElement = (props: RenderElementProps) => (
  <HeadingTwoStyle {...props.attributes}>{props.children}</HeadingTwoStyle>
);

export const HeadingThreeElement = (props: RenderElementProps) => (
  <HeadingThreeStyle {...props.attributes}>{props.children}</HeadingThreeStyle>
);

export const HeadingFourElement = (props: RenderElementProps) => (
  <HeadingFourStyle {...props.attributes}>{props.children}</HeadingFourStyle>
);

export const HeadingFiveElement = (props: RenderElementProps) => (
  <HeadingFiveStyle {...props.attributes}>{props.children}</HeadingFiveStyle>
);

export const HeadingSixElement = (props: RenderElementProps) => (
  <HeadingSixStyle {...props.attributes}>{props.children}</HeadingSixStyle>
);

export const BulletListElement = (props: RenderElementProps) => (
  <BulletListStyle {...props.attributes}>{props.children}</BulletListStyle>
);

export const NumberedListElement = (props: RenderElementProps) => (
  <NumberedListStyle {...props.attributes}>{props.children}</NumberedListStyle>
);

export const ListItemElement = (props: RenderElementProps) => (
  <ListItemStyle {...props.attributes}>{props.children}</ListItemStyle>
);

export const ParagraphElement = (props: AlignableProps) => (
  <ParagraphStyle {...props.attributes} textAlign={props.element.textAlign}>
    {props.children}
  </ParagraphStyle>
);

export const QuoteElement = (props: AlignableProps) => (
  <BlockQuoteStyle {...props.attributes} textAlign={props.element.textAlign}>
    {props.children}
  </BlockQuoteStyle>
);

export const renderElement = (props: RenderElementProps) => {
  switch (props.element.type) {
    case ContentTypeEnum.PARAGRAPH:
      return <ParagraphElement {...props} element={props.element} />;
    case HeadingTypesEnum.HEADING_ONE:
      return <HeadingOneElement {...props} />;
    case HeadingTypesEnum.HEADING_TWO:
      return <HeadingTwoElement {...props} />;
    case HeadingTypesEnum.HEADING_THREE:
      return <HeadingThreeElement {...props} />;
    case HeadingTypesEnum.HEADING_FOUR:
      return <HeadingFourElement {...props} />;
    case HeadingTypesEnum.HEADING_FIVE:
      return <HeadingFiveElement {...props} />;
    case HeadingTypesEnum.HEADING_SIX:
      return <HeadingSixElement {...props} />;
    case ListTypesEnum.BULLET_LIST:
      return <BulletListElement {...props} />;
    case ListTypesEnum.NUMBERED_LIST:
      return <NumberedListElement {...props} />;
    case ListContentEnum.LIST_ITEM:
      return <ListItemElement {...props} />;
    case ListContentEnum.LIST_ITEM_CONTAINER:
      return <div {...props.attributes}>{props.children}</div>;
    case ContentTypeEnum.BLOCKQUOTE:
      return <QuoteElement {...props} element={props.element} />;
    default:
      return <ParagraphElement {...props} element={props.element} />;
  }
};
