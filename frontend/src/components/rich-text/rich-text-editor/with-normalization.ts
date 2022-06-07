import { Editor, Element, Node, Path, Text, Transforms } from 'slate';
import { ContentTypeEnum, ListContentEnum, ListTypesEnum } from '../types/editor-enums';
import {
  isMarkKey,
  isNodeAlignableElementType,
  isNodeMarkableElementType,
  isNodeOfSameElementType,
  isOfElementType,
  isOfElementTypeFn,
} from '../types/editor-type-guards';
import {
  BulletListElementType,
  CustomTextType,
  IndentElementType,
  ListItemContainerElementType,
  ListItemElementType,
  MarkKeyList,
  NumberedListElementType,
  hasAnyComments,
  hasAnyMark,
} from '../types/editor-types';
import { IMarks, MarkKeys } from '../types/marks';

export const withNormalization = (editor: Editor) => {
  const { normalizeNode } = editor;

  // eslint-disable-next-line complexity
  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    // If node mergable.
    if (
      isOfElementType<BulletListElementType>(node, ListTypesEnum.BULLET_LIST) ||
      isOfElementType<NumberedListElementType>(node, ListTypesEnum.NUMBERED_LIST) ||
      isOfElementType<IndentElementType>(node, ContentTypeEnum.INDENT) ||
      isOfElementType<ListItemContainerElementType>(node, ListContentEnum.LIST_ITEM_CONTAINER)
    ) {
      const next = Editor.next(editor, { at: path });

      // If there is an element after it.
      if (typeof next !== 'undefined') {
        const [nextNode, nextPath] = next;

        if (isNodeOfSameElementType(nextNode, node)) {
          Transforms.mergeNodes(editor, { at: nextPath });
          return;
        }
      }

      const previous = Editor.previous(editor, { at: path });

      // If there is an element before it.
      if (previous !== undefined) {
        const [previousNode] = previous;

        if (isNodeOfSameElementType(previousNode, node)) {
          Transforms.mergeNodes(editor, { at: path });
          return;
        }
      }
    }

    // If the element is a paragraph, ensure its children are valid.
    if (Element.isElement(node) && node.type === ContentTypeEnum.PARAGRAPH) {
      for (const [child, childPath] of Node.descendants(node)) {
        if (Element.isElement(child) && !editor.isInline(child)) {
          Transforms.unwrapNodes(editor, { at: [...path, ...childPath] });
          return;
        }
      }
    }

    // If the node is a list item.
    if (isOfElementType<ListItemElementType>(node, ListContentEnum.LIST_ITEM)) {
      // And the first child of the list item is not a list item container.
      if (
        node.children.length === 0 ||
        !isOfElementType<ListItemContainerElementType>(node.children[0], ListContentEnum.LIST_ITEM_CONTAINER)
      ) {
        Transforms.insertNodes(
          editor,
          {
            type: ListContentEnum.LIST_ITEM_CONTAINER,
            children: [{ text: '' }],
          },
          { at: [...path, 0] }
        );
        return;
      }

      node.children.forEach((child, index) => {
        if (
          child.type !== ListContentEnum.LIST_ITEM_CONTAINER &&
          child.type !== ListTypesEnum.BULLET_LIST &&
          child.type !== ListTypesEnum.NUMBERED_LIST
        ) {
          Transforms.setNodes(editor, { type: ListContentEnum.LIST_ITEM_CONTAINER }, { at: [...path, index] });
        }
      });

      // And is on the top level, transform to a paragraph.
      if (path.length === 1) {
        Transforms.setNodes(
          editor,
          { type: ContentTypeEnum.PARAGRAPH },
          { at: path, match: (n) => Element.isElement(n) && n.type === ListContentEnum.LIST_ITEM }
        );
        return;
      }
    }

    if (isOfElementType<ListItemContainerElementType>(node, ListContentEnum.LIST_ITEM_CONTAINER)) {
      // And is on the top level, transform to a paragraph.
      if (path.length === 1) {
        Transforms.setNodes(
          editor,
          { type: ContentTypeEnum.PARAGRAPH },
          { at: path, match: isOfElementTypeFn(ListContentEnum.LIST_ITEM_CONTAINER) }
        );
        return;
      }
    }

    // If the node is not alignable and has a the text align property set.
    if (!isNodeAlignableElementType(node) && typeof node['textAlign'] === 'string') {
      // Remove text align property.
      Transforms.unsetNodes(editor, 'textAlign', { match: Element.isElement });
      return;
    }

    // If the node is an element and it is not markable.
    if (Element.isElement(node) && !isNodeMarkableElementType(node)) {
      // Find text nodes with at least one mark set to true.
      const [match] = Editor.nodes(editor, {
        at: path,
        mode: 'lowest',
        reverse: true,
        match: (n) => Text.isText(n) && MarkKeyList.some((mark) => n[mark]),
      });

      if (typeof match !== 'undefined') {
        // Remove all marks from text inside non-markable element.
        Transforms.unsetNodes(editor, MarkKeyList, {
          mode: 'lowest',
          at: path,
          match: Text.isText,
        });
        return;
      }
    }

    if (Text.isText(node) && node.text.length === 0 && (hasAnyMark(node) || hasAnyComments(node))) {
      removeMarksAndComments(editor, node, path);
      return;
    }

    normalizeNode(entry);
  };

  return editor;
};

const removeMarksAndComments = (editor: Editor, node: Text, path: Path) => {
  const editorMarks = Object.fromEntries(Object.entries(Editor.marks(editor) ?? {}).filter(([key]) => isMarkKey(key)));

  const preservedMarks: Omit<CustomTextType, 'text'> & IMarks = {
    ...editorMarks,
    [MarkKeys.bold]: node.bold,
    [MarkKeys.italic]: node.italic,
    [MarkKeys.underline]: node.underline,
    [MarkKeys.strikethrough]: node.strikethrough,
    [MarkKeys.superscript]: node.superscript,
    [MarkKeys.subscript]: node.subscript,
  };

  editor.marks = preservedMarks;

  const comments = Object.keys(node).filter((k) => k.startsWith('commentThreadId_'));

  Transforms.unsetNodes(editor, [...MarkKeyList, ...comments], { at: path, match: Text.isText });
};
