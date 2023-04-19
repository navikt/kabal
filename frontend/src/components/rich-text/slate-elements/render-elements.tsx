import React from 'react';
import { RegelverkContainerElement } from '@app/components/rich-text/slate-elements/regelverk';
import { RichTextTypes } from '@app/types/texts/texts';
import { CurrentDate } from '../slate-void-elements/current-date';
import { DocumentListElement } from '../slate-void-elements/document-list';
import { FlettefeltElement } from '../slate-void-elements/flettefelt/flettefelt';
import { HeaderFooterElement } from '../slate-void-elements/header-footer';
import { LabelElement } from '../slate-void-elements/label';
import { PageBreak } from '../slate-void-elements/page-break';
import { Signature } from '../slate-void-elements/signature/signature';
import {
  ContentTypeEnum,
  DeletableVoidElementsEnum,
  HeadingTypesEnum,
  ListContentEnum,
  ListTypesEnum,
  RedigerbarMaltekstEnum,
  TableContentEnum,
  TableTypeEnum,
  UndeletableContentEnum,
  UndeletableVoidElementsEnum,
} from '../types/editor-enums';
import { MaltekstElement } from './maltekst/maltekst';
import { PlaceholderElement } from './placeholder';
import { RedigerbareMalteskterElement as RedigerbareMalteksterElement } from './redigerbare-maltekster';
import { RenderElementProps } from './render-props';
import {
  BlockQuoteElement,
  BulletListElement,
  HeadingFiveElement,
  HeadingFourElement,
  HeadingOneElement,
  HeadingSixElement,
  HeadingThreeElement,
  HeadingTwoElement,
  IndentElement,
  ListItemElement,
  NumberedListElement,
  ParagraphElement,
} from './slate-elements';
import { TableElement } from './table/table';
import { TableBodyElement } from './table/tbody';
import { TableCellElement } from './table/td';
import { TableRowElement } from './table/tr';

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
      return <BulletListElement {...props} element={props.element} />;
    case ListTypesEnum.NUMBERED_LIST:
      return <NumberedListElement {...props} element={props.element} />;
    case ListContentEnum.LIST_ITEM:
      return <ListItemElement {...props} />;
    case ListContentEnum.LIST_ITEM_CONTAINER:
      return <div {...props.attributes}>{props.children}</div>;
    case ContentTypeEnum.INDENT:
      return <IndentElement {...props} element={props.element} />;
    case ContentTypeEnum.BLOCKQUOTE:
      return <BlockQuoteElement {...props} element={props.element} />;
    case UndeletableVoidElementsEnum.SIGNATURE:
      return <Signature {...props} element={props.element} />;
    case UndeletableContentEnum.MALTEKST:
      return <MaltekstElement {...props} element={props.element} />;
    case RedigerbarMaltekstEnum.REDIGERBAR_MALTEKST:
      return (
        <RedigerbareMalteksterElement {...props} element={props.element} textType={RichTextTypes.REDIGERBAR_MALTEKST} />
      );
    case RedigerbarMaltekstEnum.REGELVERKTEKST:
      return <RedigerbareMalteksterElement {...props} element={props.element} textType={RichTextTypes.REGELVERK} />;
    case UndeletableVoidElementsEnum.LABEL_CONTENT:
      return <LabelElement {...props} element={props.element} />;
    case UndeletableVoidElementsEnum.DOCUMENT_LIST:
      return <DocumentListElement {...props} element={props.element} />;
    case UndeletableVoidElementsEnum.CURRENT_DATE:
      return <CurrentDate {...props} />;
    case UndeletableVoidElementsEnum.PAGE_BREAK:
      return <PageBreak {...props} />;
    case DeletableVoidElementsEnum.FLETTEFELT:
      return <FlettefeltElement {...props} element={props.element} />;
    case UndeletableVoidElementsEnum.HEADER:
    case UndeletableVoidElementsEnum.FOOTER:
      return <HeaderFooterElement {...props} element={props.element} />;
    case UndeletableVoidElementsEnum.EMPTY_VOID:
      return (
        <div {...props.attributes} key={props.key} contentEditable={false}>
          {props.children}
        </div>
      );
    case ContentTypeEnum.PLACEHOLDER:
      return <PlaceholderElement {...props} element={props.element} />;
    case TableTypeEnum.TABLE:
      return <TableElement {...props} element={props.element} />;
    case TableContentEnum.TBODY:
      return <TableBodyElement {...props} element={props.element} />;
    case TableContentEnum.TR:
      return <TableRowElement {...props} element={props.element} />;
    case TableContentEnum.TD:
      return <TableCellElement {...props} element={props.element} />;
    case UndeletableContentEnum.REGELVERK:
      return props.children;
    case UndeletableContentEnum.REGELVERK_CONTAINER:
      return (
        <RegelverkContainerElement {...props} element={props.element}>
          {props.children}
        </RegelverkContainerElement>
      );
    default:
      return <ParagraphElement {...props} element={props.element} />;
  }
};
