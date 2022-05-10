import React from 'react';
import { AddressSection, TextTypes } from '../../../types/texts/texts';
import { CommentWrapper } from '../../smart-editor/comments/comment-wrapper';
import { AddressElement } from '../slate-void-elements/address';
import { CurrentDate } from '../slate-void-elements/current-date';
import { DocumentListElement } from '../slate-void-elements/document-list';
import { FlettefeltElement } from '../slate-void-elements/flettefelt/flettefelt';
import { LabelElement } from '../slate-void-elements/label';
import { MaltekstElement } from '../slate-void-elements/maltekst/maltekst';
import { Signature } from '../slate-void-elements/signature';
import {
  ContentTypeEnum,
  DeletableVoidElementsEnum,
  HeadingTypesEnum,
  ListContentEnum,
  ListTypesEnum,
  RedigerbarMaltekstEnum,
  UndeletableVoidElementsEnum,
} from '../types/editor-enums';
import { PageBreak } from './page-break';
import { RedigerbareMalteskterElement } from './redigerbare-maltekster';
import { RenderElementProps } from './render-props';
import {
  BulletListElement,
  HeadingFiveElement,
  HeadingFourElement,
  HeadingOneElement,
  HeadingSixElement,
  HeadingThreeElement,
  HeadingTwoElement,
  ListItemElement,
  NumberedListElement,
  ParagraphElement,
  QuoteElement,
} from './slate-elements';

// eslint-disable-next-line complexity
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
    case UndeletableVoidElementsEnum.SIGNATURE:
      return <CommentWrapper {...props} element={props.element} content={<Signature element={props.element} />} />;

    case UndeletableVoidElementsEnum.MALTEKST: {
      if (props.element.section === AddressSection.ADDRESS) {
        return <AddressElement {...props} />;
      }

      return (
        <CommentWrapper {...props} element={props.element} content={<MaltekstElement element={props.element} />} />
      );
    }

    case RedigerbarMaltekstEnum.REDIGERBAR_MALTEKST:
      return (
        <RedigerbareMalteskterElement {...props} element={props.element} textType={TextTypes.REDIGERBAR_MALTEKST} />
      );
    case RedigerbarMaltekstEnum.REGELVERKTEKST:
      return <RedigerbareMalteskterElement {...props} element={props.element} textType={TextTypes.REGELVERK} />;
    case UndeletableVoidElementsEnum.LABEL_CONTENT:
      return <CommentWrapper {...props} element={props.element} content={<LabelElement element={props.element} />} />;
    case UndeletableVoidElementsEnum.DOCUMENT_LIST:
      return (
        <CommentWrapper {...props} element={props.element} content={<DocumentListElement element={props.element} />} />
      );
    case UndeletableVoidElementsEnum.CURRENT_DATE:
      return <CurrentDate {...props} />;

    case UndeletableVoidElementsEnum.PAGE_BREAK:
      return <PageBreak {...props} />;

    case DeletableVoidElementsEnum.FLETTEFELT:
      return <FlettefeltElement {...props} element={props.element} />;

    default:
      return <ParagraphElement {...props} element={props.element} />;
  }
};
