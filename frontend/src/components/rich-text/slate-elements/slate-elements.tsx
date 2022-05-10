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
import { BulletListStyle, ListItemStyle, NumberedListStyle } from '../styled-elements/lists';
import { AlignableElementTypes } from '../types/editor-types';
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

export const BulletListElement = (props: RenderElementProps) => (
  <BulletListStyle {...props.attributes}>{props.children}</BulletListStyle>
);

export const NumberedListElement = (props: RenderElementProps) => (
  <NumberedListStyle {...props.attributes}>{props.children}</NumberedListStyle>
);

export const ListItemElement = (props: RenderElementProps) => (
  <ListItemStyle {...props.attributes}>{props.children}</ListItemStyle>
);

export const ParagraphElement = (props: RenderElementProps<AlignableElementTypes>) => (
  <ParagraphStyle {...props.attributes} textAlign={props.element.textAlign}>
    {props.children}
  </ParagraphStyle>
);

export const QuoteElement = (props: RenderElementProps<AlignableElementTypes>) => (
  <BlockQuoteStyle {...props.attributes} textAlign={props.element.textAlign}>
    {props.children}
  </BlockQuoteStyle>
);
