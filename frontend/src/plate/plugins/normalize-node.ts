import { TNodeEntry, createPluginFactory, insertNodes, isElement } from '@udecode/plate-common';

export const createNormalizeNodePlugin = createPluginFactory({
  key: 'normalize',
  withOverrides: (editor) => {
    const { normalizeNode } = editor;

    editor.normalizeNode = ([node, path]: TNodeEntry) => {
      if (isElement(node) && node.children.length === 0) {
        insertNodes(editor, { text: '' }, { at: [...path, 0] });

        return;
      }

      normalizeNode([node, path]);
    };

    return editor;
  },
});
