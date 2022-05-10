import React from 'react';
import { Descendant, Element } from 'slate';
import { RenderElementProps as RenderElementPropsBase } from 'slate-react';
import { CommentWrapper } from './comments/comment-wrapper';
import { ContentTypeEnum, HeadingTypesEnum, ListContentEnum, ListTypesEnum, VoidElementsEnum } from './editor-enums';
import { AlignableElementTypes } from './editor-types';
import { renderLeaf } from './rich-text-editor/leaf/render';
import { CurrentDate } from './slate-void-elements/current-date';
import { DocumentListElement } from './slate-void-elements/document-list';
import { LabelElement } from './slate-void-elements/label';
import { Signature } from './slate-void-elements/signature';
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
    case VoidElementsEnum.SIGNATURE:
      return <CommentWrapper {...props} element={props.element} content={<Signature element={props.element} />} />;
    case VoidElementsEnum.LABEL_CONTENT:
      return <CommentWrapper {...props} element={props.element} content={<LabelElement element={props.element} />} />;
    case VoidElementsEnum.DOCUMENT_LIST:
      return (
        <CommentWrapper {...props} element={props.element} content={<DocumentListElement element={props.element} />} />
      );
    case VoidElementsEnum.CURRENT_DATE:
      return <CurrentDate {...props} />;

    default:
      return <ParagraphElement {...props} element={props.element} />;
  }
};

export const renderTemplateElement = (elements: Descendant[]): JSX.Element[] =>
  elements.map((e, i) => {
    if (Element.isElement(e)) {
      return renderElement({
        key: i,
        element: e,
        children: renderTemplateElement(e.children),
        attributes: {
          'data-slate-node': 'element',
          ref: undefined,
        },
      });
    }

    return (
      <React.Fragment key={i}>
        {renderLeaf({
          leaf: e,
          children: e.text,
          text: e,
          attributes: {
            'data-slate-leaf': true,
          },
        })}
      </React.Fragment>
    );
  });
