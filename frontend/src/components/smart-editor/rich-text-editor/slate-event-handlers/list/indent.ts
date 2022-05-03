import { Editor, Node, NodeEntry, Path, Range, Transforms } from 'slate';
import {
  BulletListElementType,
  ListContentEnum,
  ListItemContainerElementType,
  ListItemElementType,
  ListTypesEnum,
  NumberedListElementType,
  isOfElementType,
  isOfElementTypes,
} from '../../../editor-types';
import { pruneSelection } from '../../../toolbar/functions/pruneSelection';

export const indentList = (editor: Editor) =>
  Editor.withoutNormalizing(editor, () => {
    const selection = pruneSelection(editor);

    if (selection === null) {
      return;
    }

    const listItemContainerEntries = Editor.nodes<ListItemContainerElementType>(editor, {
      mode: 'lowest',
      match: (n) => isOfElementType<ListItemContainerElementType>(n, ListContentEnum.LIST_ITEM_CONTAINER),
      reverse: false,
      at: selection,
    });

    const licArray = Array.from(listItemContainerEntries);

    const selectionTops = licArray.filter(([, licPath]) =>
      licArray.every(([, topPath]) => !Path.isDescendant(Path.parent(licPath), Path.parent(topPath)))
    );

    selectionTops
      .sort(([, a], [, b]) => Path.compare(b, a))
      .reduce<Map<string, NodeEntry<ListItemContainerElementType>[]>>((acc, lic) => {
        const [, licPath] = lic;
        const key = licPath.slice(0, -2).join(',');
        const existingGroup = acc.get(key);

        if (typeof existingGroup === 'undefined') {
          return acc.set(key, [lic]);
        }

        return acc.set(key, [...existingGroup, lic]);
      }, new Map())
      .forEach((group) => {
        const [firstEntry] = group.sort(([, a], [, b]) => Path.compare(a, b));

        if (firstEntry === undefined) {
          return;
        }

        const [, firstLicPath] = firstEntry;
        const firstLiPath = Path.parent(firstLicPath);

        if (!Path.hasPrevious(firstLiPath)) {
          return;
        }

        const [previousSiblingNode, previousSiblingPath] = Editor.node(editor, Path.previous(firstLiPath));

        if (!isOfElementType<ListItemElementType>(previousSiblingNode, ListContentEnum.LIST_ITEM)) {
          return;
        }

        const parentListPath = Path.parent(firstLiPath);

        const parentPath = firstLiPath[firstLiPath.length - 1];

        if (parentPath === undefined) {
          return;
        }

        const at: Range = {
          focus: { path: firstLiPath, offset: 0 },
          anchor: {
            path: [...parentListPath, parentPath + group.length - 1],
            offset: 0,
          },
        };

        const match = (n: Node, p: Path) =>
          isOfElementType(n, ListContentEnum.LIST_ITEM) &&
          (Path.equals(p, firstLiPath) || Path.isSibling(p, firstLiPath));

        if (previousSiblingNode.children.length === 2) {
          const to: Path = [...previousSiblingPath, 1, previousSiblingNode.children[1].children.length];
          Transforms.moveNodes(editor, { at, to, match });
          return;
        }

        const [parentListNode] = Editor.node(editor, parentListPath);

        if (
          !isOfElementTypes<BulletListElementType | NumberedListElementType>(parentListNode, [
            ListTypesEnum.BULLET_LIST,
            ListTypesEnum.NUMBERED_LIST,
          ])
        ) {
          return;
        }

        Transforms.wrapNodes(editor, { type: parentListNode.type, children: [] }, { at, match });
        Transforms.moveNodes(editor, { to: [...previousSiblingPath, 1], at: firstLiPath });
      });
  });
