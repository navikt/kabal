import { Editor, Path, Transforms } from 'slate';
import { pruneSelection } from '../../../functions/prune-selection';
import { ContentTypeEnum, ListContentEnum, ListTypesEnum } from '../../../types/editor-enums';
import { isOfElementType, isOfElementTypeFn, isOfElementTypes } from '../../../types/editor-type-guards';
import {
  BulletListElementType,
  ListItemContainerElementType,
  ListItemElementType,
  NumberedListElementType,
} from '../../../types/editor-types';

export const unindentList = (editor: Editor) =>
  Editor.withoutNormalizing(editor, () => {
    const selection = pruneSelection(editor);

    if (selection === null) {
      return;
    }

    const listItemContainerEntries = Editor.nodes<ListItemContainerElementType>(editor, {
      match: isOfElementTypeFn(ListContentEnum.LIST_ITEM_CONTAINER),
      mode: 'lowest',
      reverse: false,
      at: selection,
    });

    const licArray = Array.from(listItemContainerEntries);

    const selectionTops = licArray.filter(([, licPath]) =>
      licArray.every(([, topPath]) => !Path.isDescendant(Path.parent(licPath), Path.parent(topPath)))
    );

    selectionTops
      .sort(([, a], [, b]) => Path.compare(b, a))
      .forEach(([, licPath]) => {
        const [liNode, liPath] = Editor.parent(editor, licPath);
        const [parentListNode, parentListPath] = Editor.parent(editor, liPath);

        const isFirstListItem = liPath[liPath.length - 1] === 0;
        const isGlobalTop = liPath.length <= 2;

        // If list item is on top level.
        if (isGlobalTop) {
          // If root list item has a sublist.
          if (liNode.children.length === 2) {
            // Lift sublist up two levels.
            Transforms.liftNodes(editor, { at: [...liPath, 1] });
            Transforms.liftNodes(editor, { at: Path.next(liPath) });
          }

          // Lift list item container to root, and make it a paragraph.
          Transforms.liftNodes(editor, { at: licPath });
          Transforms.liftNodes(editor, { at: liPath });

          Transforms.setNodes(
            editor,
            { type: ContentTypeEnum.PARAGRAPH },
            { at: isFirstListItem ? parentListPath : Path.next(parentListPath) }
          );
          return;
        }

        if (
          !isOfElementTypes<BulletListElementType | NumberedListElementType>(parentListNode, [
            ListTypesEnum.BULLET_LIST,
            ListTypesEnum.NUMBERED_LIST,
          ]) ||
          !isOfElementType<ListItemElementType>(liNode, ListContentEnum.LIST_ITEM)
        ) {
          return;
        }

        const [nextSibling] = Editor.nodes<ListItemElementType>(editor, {
          at: parentListPath,
          match: (n, p) =>
            isOfElementType(n, ListContentEnum.LIST_ITEM) && Path.isSibling(p, liPath) && Path.isAfter(p, liPath),
        });

        // List item has at least one following sibling.
        if (typeof nextSibling !== 'undefined') {
          // If the list item has a sublist.
          if (liNode.children.length === 2) {
            Transforms.moveNodes(editor, {
              to: [...liPath, 1, liNode.children[1].children.length],
              at: parentListPath,
              match: (n, p) =>
                isOfElementType(n, ListContentEnum.LIST_ITEM) && Path.isSibling(p, liPath) && Path.isAfter(p, liPath),
            });
          } else {
            // If the list item has no sublist.
            // Wrap all following siblings in a new sublist.
            Transforms.wrapNodes(
              editor,
              { type: parentListNode.type, children: [] },
              {
                at: parentListPath,
                match: (n, p) =>
                  isOfElementType(n, ListContentEnum.LIST_ITEM) && Path.isSibling(p, liPath) && Path.isAfter(p, liPath),
              }
            );

            Transforms.moveNodes(editor, {
              to: [...liPath, 1],
              at: Path.next(liPath),
            });
          }
        }

        // If list item is not on top level.
        // Lift list item up two levels.
        Transforms.liftNodes(editor, { at: liPath });

        if (isFirstListItem) {
          Transforms.liftNodes(editor, { at: parentListPath });
          return;
        }

        Transforms.liftNodes(editor, { at: Path.next(parentListPath) });
      });
  });
