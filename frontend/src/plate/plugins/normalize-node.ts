import { TNodeEntry, createPluginFactory, getNode, insertNodes, isElement } from '@udecode/plate-common';
import { Scrubber } from 'slate';
import { pushEvent } from '@app/observability';

export const createNormalizeNodePlugin = createPluginFactory({
  key: 'normalize',
  withOverrides: (editor) => {
    const { normalizeNode } = editor;

    editor.normalizeNode = ([node, path]: TNodeEntry) => {
      if (isElement(node) && node.children.length === 0) {
        insertNodes(editor, { text: '' }, { at: [...path, 0] });

        const [highestAncestorPath] = path;
        const highestAncestor =
          highestAncestorPath === undefined ? undefined : Scrubber.stringify(getNode(editor, [highestAncestorPath]));

        pushEvent('normalized-empty-children', {
          ancestor: JSON.stringify(highestAncestor),
          node: JSON.stringify(node),
          path: JSON.stringify(path),
        });

        return;
      }

      normalizeNode([node, path]);
    };

    return editor;
  },
});
