/* eslint-disable complexity */
/* eslint-disable max-lines */
import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_PARAGRAPH,
  ELEMENT_TD,
  ELEMENT_TR,
  TText,
} from '@udecode/plate';
import {
  ELEMENT_CURRENT_DATE,
  ELEMENT_MALTEKST,
  ELEMENT_PAGE_BREAK,
  ELEMENT_PLACEHOLDER,
  ELEMENT_REDIGERBAR_MALTEKST,
  ELEMENT_REGELVERK,
  ELEMENT_REGELVERK_CONTAINER,
} from '@app/components/plate-editor/plugins/element-types';
import {
  BulletListElement,
  H1Element,
  H2Element,
  H3Element,
  ListItemContainerElement,
  ListItemElement,
  MaltekstElement,
  NumberedListElement,
  ParagraphElement,
  ParentOrChildElement,
  RichTextEditorElement,
  RootElement,
  TableCellElement,
  TableElement,
  TableRowElement,
  TextAlign,
} from '@app/components/plate-editor/types';
import {
  ContentTypeEnum,
  HeadingTypesEnum,
  ListContentEnum,
  ListTypesEnum,
  RedigerbarMaltekstEnum,
  TableTypeEnum,
  UndeletableContentEnum,
  UndeletableVoidElementsEnum,
} from '@app/components/rich-text/types/editor-enums';
import {
  BulletListElementType,
  CustomTextType,
  Descendant,
  EditorElement,
  HeadingFiveElementType,
  HeadingFourElementType,
  HeadingOneElementType,
  HeadingSixElementType,
  HeadingThreeElementType,
  HeadingTwoElementType,
  ListItemContainerElementType,
  ListItemElementType,
  MaltekstElementType,
  NumberedListElementType,
  ParagraphElementType,
  TableCellElementType,
  TableElementType,
  TableRowElementType,
} from '@app/components/rich-text/types/editor-types';
import { VERSION } from '@app/components/rich-text/version';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { useLazyMigrateGetAllTextsQuery, useMigrateUpdateTextsMutation } from '@app/redux-api/texts';
import { PlainText_V4, RichText_V4 } from '@app/types/rich-text/v4';
import { TemplateSections } from '@app/types/texts/template-sections';
import { ITextMetadata, IUpdateText, PlainTextTypes, RichTextTypes } from '@app/types/texts/texts';
import { ApiHook } from './types';

export const useMigrateTexts: ApiHook = () => {
  const [getAllTexts, { isLoading: getIsLoading, isSuccess: getIsSuccess, isUninitialized: getIsUninitialized }] =
    useLazyMigrateGetAllTextsQuery();
  const [
    updateTexts,
    { isLoading: updateIsLoading, isSuccess: updateIsSuccess, isUninitialized: updateIsUninitialized },
  ] = useMigrateUpdateTextsMutation();

  const execute = async () => {
    const texts = (await getAllTexts(undefined, false).unwrap()) as (ILegacyRichText | ILegacyText)[];
    const migratedTexts: IUpdateText[] = texts.map(migrate).filter(isNotNull);
    await updateTexts(migratedTexts);
  };

  return [
    execute,
    {
      isLoading: getIsLoading || updateIsLoading,
      isSuccess: getIsSuccess && updateIsSuccess,
      isUninitialized: getIsUninitialized || updateIsUninitialized,
    },
  ];
};

interface ILegacyRichText extends Omit<RichText_V4, 'content'>, ITextMetadata {
  content: EditorElement[];
}

interface ILegacyText extends PlainText_V4, ITextMetadata {}

const migrate = (text: ILegacyRichText | ILegacyText): IUpdateText => {
  if (text.textType === PlainTextTypes.FOOTER || text.textType === PlainTextTypes.HEADER) {
    return text;
  }

  if (
    text.textType === RichTextTypes.GOD_FORMULERING ||
    text.textType === RichTextTypes.MALTEKST ||
    text.textType === RichTextTypes.REDIGERBAR_MALTEKST ||
    text.textType === RichTextTypes.REGELVERK
  ) {
    const content = text.content.map(migrateRootBlock);

    return { ...text, content };
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error(`Unable to migrate from version ${text.version ?? 0} to version ${VERSION}`);
};

const migrateLegacyText = (text: CustomTextType): TText => text;

const migrateRootBlock = (node: EditorElement): RootElement => {
  switch (node.type) {
    case ContentTypeEnum.PARAGRAPH:
      return mapParagraph(node);
    case HeadingTypesEnum.HEADING_ONE:
      return mapHeadingOne(node);
    case HeadingTypesEnum.HEADING_TWO:
      return mapHeadingTwo(node);
    case HeadingTypesEnum.HEADING_THREE:
    case HeadingTypesEnum.HEADING_FOUR:
    case HeadingTypesEnum.HEADING_FIVE:
    case HeadingTypesEnum.HEADING_SIX:
      return mapHeadingThreePlus(node);
    case ListTypesEnum.NUMBERED_LIST:
      return mapNumberedList(node);
    case ListTypesEnum.BULLET_LIST:
      return mapBulletList(node);
    case TableTypeEnum.TABLE:
      return mapTable(node);
    case UndeletableVoidElementsEnum.PAGE_BREAK:
      return { ...node, type: ELEMENT_PAGE_BREAK };
    case UndeletableContentEnum.MALTEKST:
      return mapMaltekst(node);
    case RedigerbarMaltekstEnum.REDIGERBAR_MALTEKST:
      return { ...node, type: ELEMENT_REDIGERBAR_MALTEKST, children: mapDescendantToTopLevelElements(node.children) };
    case UndeletableVoidElementsEnum.CURRENT_DATE:
      return {
        ...node,
        type: ELEMENT_CURRENT_DATE,
        children: [{ text: '' }],
      };
    case UndeletableContentEnum.REGELVERK: {
      const [pageBreak, maltekst, regelverkContainer] = node.children;

      return {
        ...node,
        type: ELEMENT_REGELVERK,
        section: TemplateSections.REGELVERK,
        children: [
          { ...pageBreak, type: ELEMENT_PAGE_BREAK },
          mapMaltekst(maltekst),
          {
            ...regelverkContainer,
            type: ELEMENT_REGELVERK_CONTAINER,
            children: mapDescendantToTopLevelElements(regelverkContainer.children),
          },
        ],
      };
    }
    default:
      throw new Error(`Not implemented yet: ${node.type}`);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const migrateLegacyNode = (node: EditorElement): RichTextEditorElement => {
  switch (node.type) {
    case ListContentEnum.LIST_ITEM:
      return mapListItem(node);
    case ListContentEnum.LIST_ITEM_CONTAINER:
      return mapListItemContainer(node);
    // case TableContentEnum.TR:
    //   return mapTableRow(node);
    // case TableContentEnum.TD:
    //   return mapTableCell(node);
    case ContentTypeEnum.BLOCKQUOTE:
      return {
        ...node,
        children: node.children.map(migrateLegacyText),
        align: node.textAlign.replace('text-align-', '') as TextAlign,
        type: ELEMENT_BLOCKQUOTE,
      };
    case UndeletableContentEnum.REGELVERK_CONTAINER:
      return {
        ...node,
        type: ELEMENT_REGELVERK_CONTAINER,
        children: mapDescendantToTopLevelElements(node.children),
      };
    case ContentTypeEnum.PLACEHOLDER:
      return { ...node, type: ELEMENT_PLACEHOLDER };
    default:
      return migrateRootBlock(node);
  }
};

const mapDescendantToTopLevelElements = (descendants: Descendant[]): ParentOrChildElement[] =>
  descendants.flatMap((child) => {
    if ('text' in child) {
      return {
        type: ELEMENT_PARAGRAPH,
        align: TextAlign.LEFT,
        children: [migrateLegacyText(child)],
      };
    }

    const migrated = migrateLegacyNode(child);

    const children = Array.isArray(migrated) ? migrated : [migrated];

    return children
      .map((c) => {
        if (
          c.type === ELEMENT_MALTEKST ||
          c.type === ELEMENT_CURRENT_DATE ||
          c.type === ELEMENT_REDIGERBAR_MALTEKST ||
          c.type === ELEMENT_REGELVERK ||
          c.type === ELEMENT_REGELVERK_CONTAINER ||
          c.type === ELEMENT_LI ||
          c.type === ELEMENT_LIC ||
          c.type === ELEMENT_TR ||
          c.type === ELEMENT_TD ||
          c.type === ELEMENT_PLACEHOLDER
        ) {
          return null;
        }

        return c;
      })
      .filter(isNotNull);
  });

const mapParagraph = (paragraph: ParagraphElementType): ParagraphElement => ({
  ...paragraph,
  type: 'p',
  align: paragraph.textAlign.replace('text-align-', '') as TextAlign,
  children: paragraph.children.map(migrateLegacyText),
});

const mapMaltekst = (maltekst: MaltekstElementType): MaltekstElement => ({
  ...maltekst,
  type: ELEMENT_MALTEKST,
  children: mapDescendantToTopLevelElements(maltekst.children),
});

const mapListItemContainer = (lic: ListItemContainerElementType): ListItemContainerElement => ({
  ...lic,
  type: 'lic',
  children: lic.children.map(migrateLegacyText),
});

const mapListItem = (listItem: ListItemElementType): ListItemElement => {
  const children: ListItemElement['children'] = (() => {
    const [lic, list] = listItem.children;

    if (typeof list !== 'undefined' && typeof lic !== 'undefined') {
      return [mapListItemContainer(lic), list.type === 'bullet-list' ? mapBulletList(list) : mapNumberedList(list)];
    }

    if (typeof lic !== 'undefined') {
      return [mapListItemContainer(lic)];
    }

    return [{ type: ELEMENT_LIC, children: [{ text: '' }] }];
  })();

  return {
    ...listItem,
    type: 'li',
    children,
  };
};

const mapNumberedList = (list: NumberedListElementType): NumberedListElement => ({
  ...list,
  type: 'ol',
  children: list.children.map(mapListItem),
});

const mapBulletList = (list: BulletListElementType): BulletListElement => ({
  ...list,
  type: 'ul',
  children: list.children.map(mapListItem),
});

const mapTable = (table: TableElementType): TableElement => ({
  ...table,
  type: 'table',
  children: table.children.flatMap((body) => body.children.map(mapTableRow)),
});

const mapTableRow = (row: TableRowElementType): TableRowElement => ({
  ...row,
  type: 'tr',
  children: row.children.map(mapTableCell),
});

const mapTableCell = (cell: TableCellElementType): TableCellElement => ({
  ...cell,
  type: 'td',
  children: cell.children
    .map((node) => {
      if (node.type === 'paragraph') {
        return mapParagraph(node);
      }

      if (node.type === 'numbered-list') {
        return mapNumberedList(node);
      }

      if (node.type === 'bullet-list') {
        return mapBulletList(node);
      }

      return null;
    })
    .filter(isNotNull),
});

const mapHeadingOne = (heading: HeadingOneElementType): H1Element => ({
  ...heading,
  type: 'h1',
  children: heading.children.map(migrateLegacyText),
});

const mapHeadingTwo = (heading: HeadingTwoElementType): H2Element => ({
  ...heading,
  type: 'h2',
  children: heading.children.map(migrateLegacyText),
});

const mapHeadingThreePlus = (
  heading: HeadingThreeElementType | HeadingFourElementType | HeadingFiveElementType | HeadingSixElementType
): H3Element => ({
  ...heading,
  type: 'h3',
  children: heading.children.map(migrateLegacyText),
});
