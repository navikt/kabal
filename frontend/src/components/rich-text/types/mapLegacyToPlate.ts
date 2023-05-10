import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_TABLE,
  ELEMENT_TD,
  ELEMENT_TR,
  ELEMENT_UL,
} from '@udecode/plate';
import { ELEMENT_CURRENT_DATE } from '@app/components/plate-editor/plugins/current-date';
import { ELEMENT_MALTEKST } from '@app/components/plate-editor/plugins/maltekst';
import { ELEMENT_PAGE_BREAK } from '@app/components/plate-editor/plugins/page-break';
import { ELEMENT_PLACEHOLDER } from '@app/components/plate-editor/plugins/placeholder';
import { ELEMENT_REDIGERBAR_MALTEKST } from '@app/components/plate-editor/plugins/redigerbar-maltekst';
import { ELEMENT_REGELVERK, ELEMENT_REGELVERK_CONTAINER } from '@app/components/plate-editor/plugins/regelverk';
import { createSimpleParagraph } from '@app/components/plate-editor/templates/helpers';
import { EditorValue, RichTextEditorElements, RootBlock, TextAlign } from '@app/components/plate-editor/types';
import {
  ContentTypeEnum,
  HeadingTypesEnum,
  ListContentEnum,
  ListTypesEnum,
  RedigerbarMaltekstEnum,
  TableContentEnum,
  TableTypeEnum,
  UndeletableContentEnum,
  UndeletableVoidElementsEnum,
} from '@app/components/rich-text/types/editor-enums';
import { NonVoidElementTypes } from '@app/components/rich-text/types/editor-types';
import { VoidElementTypes } from '@app/components/rich-text/types/editor-void-types';

export type LegacyElement = NonVoidElementTypes | VoidElementTypes;

// eslint-disable-next-line complexity
export const mapLegacyElementToRichTextEditorElements = (element: LegacyElement): RichTextEditorElements => {
  switch (element.type) {
    case ContentTypeEnum.PARAGRAPH:
      return { indent: element.indent, align: TextAlign.LEFT, type: ELEMENT_PARAGRAPH, children: element.children };
    case TableTypeEnum.TABLE:
      return {
        ...element,
        type: ELEMENT_TABLE,
        children: element.children.map(mapLegacyElementToRichTextEditorElements),
      };
    case TableContentEnum.TBODY:
      return {
        ...element,
        children: element.children.map(mapLegacyElementToRichTextEditorElements),
      };
    case TableContentEnum.TR:
      return {
        ...element,
        children: element.children.map(mapLegacyElementToRichTextEditorElements),
        type: ELEMENT_TR,
      };
    case TableContentEnum.TD:
      return {
        ...element,
        children: element.children.map(mapLegacyElementToRichTextEditorElements),
        type: ELEMENT_TD,
      };
    case ContentTypeEnum.PLACEHOLDER:
      return { ...element, type: ELEMENT_PLACEHOLDER };
    case ListTypesEnum.BULLET_LIST:
      return {
        ...element,
        children: element.children.map(mapLegacyElementToRichTextEditorElements),
        type: ELEMENT_UL,
      };
    case ListTypesEnum.NUMBERED_LIST:
      return {
        ...element,
        children: element.children.map(mapLegacyElementToRichTextEditorElements),
        type: ELEMENT_OL,
      };
    case HeadingTypesEnum.HEADING_ONE:
      return { ...element, type: ELEMENT_H1 };
    case HeadingTypesEnum.HEADING_TWO:
      return { ...element, type: ELEMENT_H2 };
    case HeadingTypesEnum.HEADING_THREE:
      return { ...element, type: ELEMENT_H3 };
    case ListContentEnum.LIST_ITEM:
      return { ...element, children: element.children.map(mapLegacyElementToRichTextEditorElements), type: ELEMENT_LI };
    case ListContentEnum.LIST_ITEM_CONTAINER:
      return {
        ...element,
        type: ELEMENT_LIC,
      };
    case RedigerbarMaltekstEnum.REDIGERBAR_MALTEKST:
      // @ts-ignore
      return {
        section: element.section,
        // @ts-ignore
        children: element.children.map(mapLegacyElementToRichTextEditorElements),
        type: ELEMENT_REDIGERBAR_MALTEKST,
      };
    case UndeletableContentEnum.MALTEKST:
      return {
        ...element,
        // @ts-ignore
        children: element.children.map(mapLegacyElementToRichTextEditorElements),
        type: ELEMENT_MALTEKST,
      };
    case UndeletableContentEnum.REGELVERK:
      return {
        ...element,
        children: element.children.map(mapLegacyElementToRichTextEditorElements),
        type: ELEMENT_REGELVERK,
      };
    case UndeletableContentEnum.REGELVERK_CONTAINER:
      return {
        ...element,
        // @ts-ignore
        children: element.children.map(mapLegacyElementToRichTextEditorElements),
        type: ELEMENT_REGELVERK_CONTAINER,
      };
    case UndeletableVoidElementsEnum.CURRENT_DATE:
      return { ...element, type: ELEMENT_CURRENT_DATE };
    case UndeletableVoidElementsEnum.PAGE_BREAK:
      return { ...element, type: ELEMENT_PAGE_BREAK };
    default: {
      console.warn(`Not implemented yet: ${element.type}`);

      return createSimpleParagraph();
    }
  }
};
