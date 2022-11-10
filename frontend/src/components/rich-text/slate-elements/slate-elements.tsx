import React from 'react';
import { BlockQuoteStyle, ParagraphStyle } from '../styled-elements/content';
import {
  HeadingFiveStyle,
  HeadingFourStyle,
  HeadingOneStyle,
  HeadingSixStyle,
  HeadingThreeStyle,
  HeadingTwoStyle,
} from '../styled-elements/headings';
import { IndentStyle } from '../styled-elements/indent';
import { BulletListStyle, ListItemStyle, NumberedListStyle } from '../styled-elements/lists';
import {
  BlockquoteElementType,
  BulletListElementType,
  NumberedListElementType,
  ParagraphElementType,
} from '../types/editor-types';
import { RenderElementProps } from './render-props';

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

export const BulletListElement = (props: RenderElementProps<BulletListElementType>) => (
  <BulletListStyle {...props.attributes} indent={props.element.indent}>
    {props.children}
  </BulletListStyle>
);

export const NumberedListElement = (props: RenderElementProps<NumberedListElementType>) => (
  <NumberedListStyle {...props.attributes} indent={props.element.indent}>
    {props.children}
  </NumberedListStyle>
);

export const ListItemElement = (props: RenderElementProps) => (
  <ListItemStyle {...props.attributes}>{props.children}</ListItemStyle>
);

export const ParagraphElement = (props: RenderElementProps<ParagraphElementType>) => (
  <ParagraphStyle {...props.attributes} indent={props.element.indent} textAlign={props.element.textAlign}>
    {props.children}
  </ParagraphStyle>
);

export const IndentElement = (props: RenderElementProps) => (
  <IndentStyle {...props.attributes}>{props.children}</IndentStyle>
);

export const BlockQuoteElement = (props: RenderElementProps<BlockquoteElementType>) => (
  <BlockQuoteStyle {...props.attributes} textAlign={props.element.textAlign}>
    {props.children}
  </BlockQuoteStyle>
);
